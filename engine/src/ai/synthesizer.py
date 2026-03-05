import tiktoken

class ContextBuilder:
    def __init__(self, scip_index_accessor):
        self.indexer = scip_index_accessor
        # Using cl100k_base as a proxy for Qwen3/modern LLM tokenizers
        self.tokenizer = tiktoken.get_encoding("cl100k_base")
        self.TOKEN_BUDGET = 30000

    def build_dense_context(self, resolved_node_ids: list[str]) -> str:
        """
        Takes the small subset of nodes isolated by DuckDB and retrieves
        their actual source code or docstrings from the SCIP index/FileSystem.
        Applies strict Token Budgeting to prevent LLM Context Collapse.
        """
        full_context = ""
        stripped_context = ""
        
        for node_id in resolved_node_ids:
            source_code = self.indexer.get_symbol_definition(node_id)
            docstring = self.indexer.get_symbol_docstring(node_id) or "No docstring available."
            
            full_context += f"\\n--- {node_id} ---\\n{source_code}\\n"
            stripped_context += f"\\n--- {node_id} ---\\nDocstring: {docstring}\\n"
            
        # Token Check
        tokens = self.tokenizer.encode(full_context)
        if len(tokens) > self.TOKEN_BUDGET:
            print(f"Danger: Fetched {len(tokens)} tokens. Exceeds budget of {self.TOKEN_BUDGET}. Degrading to docstrings only.")
            return stripped_context
            
        return full_context

class GraphSynthesizer:
    def __init__(self, llm_client):
        self.llm = llm_client
        self.system_prompt = """
        You are VisionFlow's Final Synthesizer. You answer the user's software architecture query.
        You MUST ONLY use the provided dense context below, which was retrieved directly from the codebase graph.
        Do not hallucinate edges or files that are not present in the context.
        """

    async def synthesize_stream(self, user_prompt: str, dense_context: str):
        """
        Yields tokens for SSE Streaming.
        """
        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": f"Context:\\n{dense_context}\\n\\nQuestion: {user_prompt}"}
        ]
        
        # Prototype streaming interface
        # In production: async for chunk in self.llm.chat_stream(messages):
        # We yield mock chunks for demonstrating the SSE architecture output
        mock_response = ["The ", "latency ", "originates ", "in ", "the ", "billing ", "service."]
        for chunk in mock_response:
            yield chunk
