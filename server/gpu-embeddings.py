# embed-gpus-fixed.py
import json
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

with open('converted.json') as f:
    gpus = json.load(f)['data']

embeddings = []
for gpu in gpus:
    try:
        text = (
            f"{gpu.get('resource_class', 'Unknown-Class')} "
            f"{gpu.get('gpu_description', 'No-Description')} | "
            f"{gpu['vcpus']}vCPU | "  # Required field (from problem statement)
            f"{gpu['ram']}GB | "      # Required field
            f"₹{gpu['price_per_hour']}/hr"
        )
    except KeyError as e:
        print(f"Skipping invalid entry: Missing required field {e}")
        continue

    embedding = model.encode(text)
    embeddings.append({
        "text": text,
        "embedding": embedding.tolist(),
        "metadata": gpu
    })

with open('gpu-embeddings.json', 'w') as f:
    json.dump(embeddings, f)