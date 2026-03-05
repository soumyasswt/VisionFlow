from .schemas import IntentClassification, GraphQuery
import json

class GraphQueryPlanner:
    def __init__(self, llm_client):
        """
        llm_client: Abstraction for Qwen3-VL or similar model.
        """
        self.llm = llm_client
        
        self.system_prompt = """
        You are VisionFlow's Graph Query Planner. You translate user questions about software architectures into a strict JSON DSL.
        You map logical component names to 'source_entity' and 'target_entity'.
        
        Available query_types: 'path', 'neighbors', 'impact'
        Available edge_filters: 'CALLS', 'IMPORTS', 'INHERITS', 'EXPORTS'
        
        Provide only the raw JSON.
        """

    def generate_dsl(self, user_prompt: str, context_entities: list[str]) -> GraphQuery:
        """
        Example: "How does the billing service connect to the redis cache?"
        Outputs: GraphQuery(query_type="path", source_entity="billing_service", target_entity="redis_cache", max_depth=3)
        """
        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": f"Entities present in graph: {context_entities}\nQuestion: {user_prompt}"}
        ]
        
        # This assumes the LLM supports structured outputs or JSON mode.
        response_json_str = self.llm.chat(messages, response_format={"type": "json_object"})
        
        # Pydantic validates the response and enforces the schema.
        # If the LLM hallucinates an invalid query_type, Pydantic raises an error here, which should trigger a retry.
        return GraphQuery.model_validate_json(response_json_str)
