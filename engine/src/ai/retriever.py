import duckdb
from .schemas import GraphQuery

class GraphRetriever:
    MAX_NODES_PER_RETRIEVAL = 200

    def __init__(self, con: duckdb.DuckDBPyConnection):
        self.con = con

    def resolve_entity_to_id(self, entity_name: str, commit_id: str) -> str:
        """
        Fuzzy matches the natural language entity name ("billing DB") to a SCIP deterministic ID.
        In production, this would use pgvector or duckdb's full-text search against the `symbol` and `file_path` fields.
        """
        query = f"""
            SELECT node_id FROM nodes 
            WHERE symbol ILIKE '%{entity_name}%' 
               OR file_path ILIKE '%{entity_name}%'
            AND commit_id = ?
            LIMIT 1
        """
        result = self.con.execute(query, [commit_id]).fetchone()
        if not result:
            raise ValueError(f"Entity '{entity_name}' could not be resolved in the graph.")
        return result[0]

    def execute_dsl(self, query: GraphQuery, commit_id: str) -> dict:
        """
        Translates the DSL back into DuckDB SQL to fetch the context window subgraph.
        """
        source_id = self.resolve_entity_to_id(query.source_entity, commit_id)
        
        # Simplified query builder based on DSL shape
        if query.query_type == "neighbors" or query.query_type == "impact":
            sql = """
            WITH RECURSIVE traverse AS (
                SELECT target_id, source_id, edge_type, 1 as depth
                FROM edges WHERE source_id = ? AND commit_id = ?
                UNION ALL
                SELECT e.target_id, e.source_id, e.edge_type, t.depth + 1
                FROM edges e INNER JOIN traverse t ON e.source_id = t.target_id
                WHERE t.depth < ? AND e.commit_id = ?
            )
            SELECT target_id FROM traverse LIMIT ?
            """
            
            # Anti-hallucination / Context Collapse safety
            nodes = self.con.execute(sql, [source_id, commit_id, query.max_depth, commit_id, self.MAX_NODES_PER_RETRIEVAL + 1]).fetchall()
            
            if len(nodes) > self.MAX_NODES_PER_RETRIEVAL:
                raise ValueError("Graph explosion detected: Result exceeds token logic capacity. Please refine the DSL filtering.")
                
            return {"nodes": [n[0] for n in nodes]}

        elif query.query_type == "path":
            # Shortest Path implementation would go here using DuckDB network operators or recursive CTEs
            pass
            
        return {}
