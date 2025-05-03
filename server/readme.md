# Yukti-Bot GPU Recommendation  API Server

A FastAPI-based service that provides GPU recommendations using semantic search and LLM-powered explanations with streaming support.

## Features

- 💬 Natural language query processing
- 🔍 Semantic search using GPU embeddings
- ⚡ Real-time streaming responses
- 🛠️ Integrated with Groq's LLM API
- 🏥 Health check endpoint
- 🔒 CORS configured for cross-origin access

## Prerequisites

- Python 3.9+
- Groq API key (sign up at [Groq Cloud](https://console.groq.com/))
- `converted.json` file from previous processing steps

## Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AnshJain9159/CloudYukti
   cd server
   ```

2. **Create virtual environment**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate     # Windows
   # source .venv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create `.env` file:
   ```env
   GROQ_API_KEY=your_api_key_here
   ```

## Data Preparation

Generate embeddings (run once):
```bash
python embed-gpus-fixed.py
```
This creates `gpu-embeddings.json` from your `converted.json`

## Running the Server

```bash
uvicorn main:app --reload
```
Server will be available at http://localhost:8000

## API Documentation

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/recommend` | POST | Get streaming GPU recommendations |
| `/health` | GET | Service health check |

### Recommendation Request

**Endpoint**: `POST /recommend`

**Request Body**:
```json
{
  "query": "GPU for deep learning under ₹1000/hour",
  "top_k": 3
}
```

**Parameters**:
- `query`: Natural language description of requirements (required)
- `top_k`: Number of recommendations to return (1-10, default:3)

**Streaming Response**:
```http
HTTP/1.1 200 OK
Content-Type: text/event-stream

Based on your requirements... 
1. A100 Instance...
```

### Health Check

**Endpoint**: `GET /health`

**Response**:
```json
{
  "status": "healthy",
  "timestamp": 1717041523.548
}
```

## Usage Examples

### cURL Request
```bash
curl -X POST "http://localhost:8000/recommend" \
  -H "Content-Type: application/json" \
  -d '{"query": "Best GPU for AI inference in Mumbai", "top_k": 2}'
```

### Python Client
```python
import requests

response = requests.post(
    "http://localhost:8000/recommend",
    json={"query": "GPU with 24GB VRAM under ₹1500/hour"},
    stream=True
)

for line in response.iter_content():
    print(line.decode(), end='')
```

## Project Structure

```
├── server.py            # Main API server
├── gpu-embeddings.py  # Embedding generator
├── converted.json       # Processed GPU data
├── gpu-embeddings.json  # Generated embeddings
├── requirements.txt     # Dependencies
└── .env                 # Environment variables
```

## Troubleshooting

### Common Issues:

1. **Missing GROQ_API_KEY**:
   - Verify `.env` file exists with valid key
   - Restart server after adding key

2. **Embedding File Not Found**:
   - Run `python gpu-embeddings.py` first
   - Verify `converted.json` exists

3. **Streaming Issues**:
   - Use proper SSE client
   - Check network connectivity to Groq API

4. **CORS Errors**:
   - Ensure frontend is configured correctly
   - Verify CORS middleware in server.py

## License

MIT License