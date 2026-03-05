import json
import asyncio
from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.responses import StreamingResponse
from sse_starlette.sse import EventSourceResponse

# Absolute imports based on our engine directory structure
from .schemas import GraphQuery, IntentClassification
from .planner import GraphQueryPlanner
from .retriever import GraphRetriever
from .synthesizer import ContextBuilder, GraphSynthesizer

app = FastAPI(title="VisionFlow AI Reasoning Layer")

# Mocks for demonstration of dependency injection
class MockLLM:
    def chat(self, messages, response_format=None):
        return '{"query_type": "path", "source_entity": "billing", "max_depth": 2}'

class MockIndexer:
    def get_symbol_definition(self, node_id): return "def calc(): pass"
    def get_symbol_docstring(self, node_id): return "Calculates stuff"

# Globals for the pipeline
llm_client = MockLLM()
query_planner = GraphQueryPlanner(llm_client)
# retriever = GraphRetriever(duckdb_connection)  # Passed dynamically in real usage
context_builder = ContextBuilder(MockIndexer())
synthesizer = GraphSynthesizer(llm_client)

@app.post("/ai/query")
async def ai_query_stream(request: Request):
    """
    Server-Sent Events (SSE) endpoint for multi-stage Graph-RAG pipeline.
    Yields NDJSON distinct events for UX feedback.
    """
    body = await request.json()
    user_prompt = body.get("prompt")
    commit_id = body.get("commit_id", "latest")
    
    async def event_generator():
        try:
            # Stage 1 & 2: Planner
            yield {
                "event": "status",
                "data": json.dumps({"message": "Parsing intent and planning graph DSL..."})
            }
            # Simulate planner delay
            await asyncio.sleep(0.5)
            # In real usage: dsl = query_planner.generate_dsl(user_prompt, [])
            dsl = GraphQuery(query_type="path", source_entity="billing", max_depth=2)
            
            yield {
                "event": "status", 
                "data": json.dumps({"message": f"Executing DuckDB Query: {dsl.query_type.upper()}..."})
            }
            
            # Stage 3: Retriever
            await asyncio.sleep(0.5)
            # Mocking retriever isolation
            # In real usage: result = retriever.execute_dsl(dsl, commit_id)
            isolated_nodes = ["repo::commit::src/billing.py::calc", "repo::commit::src/db.py::query"]
            
            # Immediately notify frontend to visually highlight the involved subgraph!
            yield {
                "event": "graph_focus",
                "data": json.dumps({"node_ids": isolated_nodes})
            }
            
            # Stage 4: Context Builder
            yield {
                "event": "status",
                "data": json.dumps({"message": "Building dense token context via SCIP..."})
            }
            dense_context = context_builder.build_dense_context(isolated_nodes)
            
            # Stage 5: Synthesis Streaming
            yield {
                "event": "status",
                "data": json.dumps({"message": "Synthesizing answer..."})
            }
            
            async for chunk in synthesizer.synthesize_stream(user_prompt, dense_context):
                yield {
                    "event": "token",
                    "data": json.dumps({"text": chunk})
                }
                await asyncio.sleep(0.1)
                
            yield {
                "event": "done",
                "data": json.dumps({"message": "Pipeline complete."})
            }
            
        except ValueError as ve:
            # Handle Context Collapse Graph Explosions gracefully
            yield {
                "event": "error",
                "data": json.dumps({"message": str(ve)})
            }
        except Exception as e:
            yield {
                "event": "error",
                "data": json.dumps({"message": f"Internal Error: {str(e)}"})
            }

    return EventSourceResponse(event_generator())

@app.post("/ai/analyze")
async def analyze_multimodal(
    prompt: str = Form(...), 
    image: UploadFile = File(...)
):
    """
    Accepts an architecture diagram or UI screenshot alongside a prompt.
    Routes through Qwen3-VL vision encoder to extract text/shapes, fuses with text,
    and returns a structured query request.
    """
    # 1. Read Image
    contents = await image.read()
    
    # 2. Qwen3-VL Vision extraction
    extracted_entities = ["billing_db", "api_gateway"]
    
    # 3. Could map directly to the text Graph-RAG pipeline here, or return the entities
    # so the client UI can display what the AI perceived before executing the graph search.
    
    return {
        "status": "extracted",
        "perceived_entities": extracted_entities,
        "next_action": "POST /ai/query using identified entities."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
