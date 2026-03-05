FROM python:3.11-slim
WORKDIR /app

# System dependencies for scip, duckdb, etc
RUN apt-get update && apt-get install -y git build-essential

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install uvicorn fastapi tiktoken python-multipart sse-starlette duckdb pydantic

COPY . .

EXPOSE 8000
CMD ["uvicorn", "src.ai.router:app", "--host", "0.0.0.0", "--port", "8000"]
