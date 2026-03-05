from pydantic import BaseModel, Field
from typing import List, Optional

class GraphQuery(BaseModel):
    """
    The structured DSL that Qwen3-VL must output based on the user's plain text prompt.
    This intermediate layer prevents hallucinations by forcing strict enum constraints and node searches.
    """
    query_type: str = Field(
        ..., 
        description="Must be one of: 'path' (find route between nodes), 'neighbors' (find adjacent nodes), 'impact' (find downstream dependents)"
    )
    source_entity: str = Field(
        ..., 
        description="The starting component, function, or file described in the user prompt."
    )
    target_entity: Optional[str] = Field(
        None, 
        description="The destination component, function, or file, if query_type is 'path'."
    )
    edge_filters: List[str] = Field(
        default_factory=list, 
        description="Optional list of edge types to traverse (e.g., 'CALLS', 'IMPORTS', 'INHERITS'). Leave empty to traverse all."
    )
    max_depth: int = Field(
        default=2, 
        description="The maximum hop distance for the traversal. Keep between 1-5 to prevent graph explosions."
    )

class IntentClassification(BaseModel):
    """
    Stage 1: Intent Routing
    """
    task_type: str = Field(description="Must be 'GRAPH_QUERY', 'SUMMARIZATION', or 'CODE_GENERATION'")
    requires_vision: bool = Field(description="True if the user attached an architectural image to parse.")
    entities_mentioned: List[str] = Field(description="List of specific components or services mentioned.")
