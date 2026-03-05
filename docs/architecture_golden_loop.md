# VisionFlow Architecture: The "Golden Loop"

This document outlines the real-time UX cycle (The Golden Loop) that bridges the AI Reasoning backend, the Data delivery layer, and the GPU rendering frontend.

## 1. The Multi-modal AI Reasoning Pipeline (Phase 5)

The AI Reasoning layer validates queries to prevent hallucination and uses Token Budgeting to prevent context collapse.

```mermaid
flowchart TD
    User([User Prompt]) --> Router(FastAPI Router)
    Router --> Planner(Graph Query Planner)
    Planner -- "LLM generates Pydantic DSL" --> DSL{JSON DSL Schema}
    DSL -- "Strict constraints" --> Retriever(DuckDB Retriever)
    Retriever -- "MAX_NODES=200 guardrail" --> ContextBuilder(Context Builder)
    ContextBuilder -- "Tiktoken check (<30k)" --> Synthesizer(Qwen3-VL Synthesizer)
    Synthesizer --> Output([Final Streaming Answer])
```

## 2. The Golden Loop: End-to-End Real-Time Execution

This sequence details the real-time interaction where the frontend achieves instant responsiveness by orchestrating AI reasoning and WebGL rendering concurrently over Server-Sent Events (SSE).

```mermaid
sequenceDiagram
    participant User
    participant React UI
    participant FastAPI (Python)
    participant Retriever (DuckDB)
    participant WebGL Controller
    participant Web Worker
    participant Node API (Fastify)
    participant Redis Cache
    
    User->>React UI: Enters natural language query
    React UI->>FastAPI (Python): POST /ai/query
    FastAPI (Python)->>FastAPI (Python): Parse intent & generate Pydantic DSL
    FastAPI (Python)->>Retriever (DuckDB): Execute recursive CTE
    Retriever (DuckDB)-->>FastAPI (Python): 15-50 SCIP Node IDs
    
    %% The SSE Kickoff
    FastAPI (Python)-->>React UI: SSE {"event": "graph_focus", "data": {"node_ids": [...]}}
    
    %% The Client Handoff & GPU Tween
    React UI->>WebGL Controller: .focusNodesByIndex([...]) (Bypasses React DOM)
    WebGL Controller->>WebGL Controller: Calculate Spline & Camera Tween (Pan/Zoom)
    
    %% Tile Streaming
    note over WebGL Controller, Web Worker: Frustum Culler detects new topological region
    WebGL Controller->>Web Worker: fetch_chunks()
    Web Worker->>Node API (Fastify): GET /graph/neighbors
    Node API (Fastify)->>Redis Cache: GET (O(1) hit)
    Node API (Fastify)-->>Web Worker: Protobuf binary payload
    Web Worker->>Web Worker: Zero-copy FloatArray decoding
    Web Worker-->>WebGL Controller: transfer(ArrayBuffers)
    
    %% The Synthesis
    FastAPI (Python)->>FastAPI (Python): Synthesize response via Qwen3-VL
    loop Streaming Output
        FastAPI (Python)-->>React UI: SSE {"event": "token", "data": {"text": "..."}}
        React UI->>User: Displays text instantly while camera finishes pan
    end
```

### Critical Interactions

1. **The Client Handoff**: The React UI acts strictly as a signal relay. When `graph_focus` is received, it patches the nodes straight into `WebGLController`, avoiding any DOM reconciliation overhead for the visualization.
2. **The GPU Tween**: The camera pans seamlessly to the topological destination. Concurrently, the Web Worker dynamically streams any missing nodes from the Node.js API over Protobuf in the background.
3. **The Synthesis Overlay**: By the time the camera rests on the active nodes and MSDF text labels resolve crisply on the screen, the LLM synthesis is already streaming the answer to the user character-by-character.
