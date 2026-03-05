import duckdb

def init_schema(con: duckdb.DuckDBPyConnection):
    """Initialize the versioned DuckDB graph schema."""
    # Nodes table (stable ID schema)
    con.execute('''
        CREATE TABLE IF NOT EXISTS nodes (
            node_id VARCHAR PRIMARY KEY,  -- repo::commit::path::symbol
            symbol VARCHAR,
            type VARCHAR,
            file_id VARCHAR,
            commit_id VARCHAR
        )
    ''')

    # Edges table
    con.execute('''
        CREATE TABLE IF NOT EXISTS edges (
            source_id VARCHAR,
            target_id VARCHAR,
            edge_type VARCHAR,
            commit_id VARCHAR
        )
    ''')
    
    # File Dependency Tracking (O(1) Blast Radius lookups)
    con.execute('''
        CREATE TABLE IF NOT EXISTS file_dependencies (
            src_file VARCHAR,
            dst_file VARCHAR,
            repo VARCHAR,
            commit_id VARCHAR
        )
    ''')
    
    # Materialized inheritance index
    con.execute('''
        CREATE TABLE IF NOT EXISTS inheritance_index (
            base_symbol VARCHAR,
            derived_symbol VARCHAR,
            depth INTEGER
        )
    ''')
    print("DuckDB schema initialized.")
