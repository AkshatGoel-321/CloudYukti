from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import numpy as np
import json
from groq import Groq
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import os
import logging
from time import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class Config:
    """Application configuration"""
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY")
    MODEL_NAME: str = "llama3-8b-8192"
    EMBEDDINGS_FILE: str = "gpu-embeddings.json"
    SENTENCE_TRANSFORMER: str = "all-MiniLM-L6-v2"
    TOP_K_RESULTS: int = 3

class GPUQuery(BaseModel):
    """Request model for GPU recommendations"""
    query: str = Field(..., min_length=3, description="User query for GPU recommendation")
    top_k: int = Field(default=Config.TOP_K_RESULTS, ge=1, le=10)

class GPURecommender:
    def __init__(self):
        self._load_dependencies()
        self._load_embeddings()

    def _load_dependencies(self):
        """Initialize models and clients"""
        if not Config.GROQ_API_KEY:
            raise EnvironmentError("GROQ_API_KEY not found in environment variables")
        
        self.model = SentenceTransformer(Config.SENTENCE_TRANSFORMER)
        self.client = Groq(api_key=Config.GROQ_API_KEY)

    def _load_embeddings(self):
        """Load pre-computed GPU embeddings"""
        try:
            with open(Config.EMBEDDINGS_FILE) as f:
                self.embeddings = json.load(f)
            logger.info(f"Loaded {len(self.embeddings)} GPU embeddings")
        except FileNotFoundError:
            raise FileNotFoundError(f"Embeddings file {Config.EMBEDDINGS_FILE} not found")

    def find_relevant_gpus(self, query: str, top_k: int = Config.TOP_K_RESULTS) -> List[tuple]:
        """Find most relevant GPUs based on query similarity"""
        start_time = time()
        query_embed = self.model.encode(query)
        
        # Compute similarities
        scores = [
            (np.dot(query_embed, emb['embedding']), emb['metadata'])
            for emb in self.embeddings
        ]
        
        # Sort by similarity score
        sorted_scores = sorted(scores, key=lambda x: x[0], reverse=True)
        
        logger.info(f"Found top {top_k} GPUs in {time() - start_time:.2f}s")
        return sorted_scores[:top_k]

    async def generate_stream(self, prompt: str, context: List[Dict[str, Any]]):
        """Generate streaming response using Groq"""
        try:
            response = self.client.chat.completions.create(
                model=Config.MODEL_NAME,
                messages=[
                    {"role": "system", "content": (
                        "You are a GPU recommendation expert. "
                        f"Use this GPU context to answer: {context}"
                    )},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                stream=True
            )
            
            for chunk in response:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
                    
        except Exception as e:
            logger.error(f"Error in generate_stream: {str(e)}")
            yield "\nSorry, there was an error generating the response."

# Initialize FastAPI app
app = FastAPI(
    title="GPU Recommendation API",
    description="API for getting GPU recommendations based on natural language queries",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize recommender
recommender = GPURecommender()

@app.post("/recommend", summary="Get GPU recommendations")
async def recommend_gpu(query: GPUQuery):
    """
    Get streaming GPU recommendations based on natural language query.
    
    Args:
        query (GPUQuery): Query parameters including the search query and optional top_k
        
    Returns:
        StreamingResponse: Streamed recommendations and explanations
    """
    try:
        # Get relevant GPUs
        relevant_gpus = recommender.find_relevant_gpus(query.query, query.top_k)
        context = [gpu[1] for gpu in relevant_gpus]
        
        return StreamingResponse(
            recommender.generate_stream(query.query, context),
            media_type="text/event-stream"
        )
        
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": time()}