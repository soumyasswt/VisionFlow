import duckdb

def init_db():
    con = duckdb.connect('visionflow.duckdb')
    con.execute('''
        CREATE TABLE IF NOT EXISTS nodes (
            symbol_id VARCHAR PRIMARY KEY,
            repo VARCHAR,
            commit_hash VARCHAR,
            file_path VARCHAR,
            type VARCHAR,
            state VARCHAR,
            created_at_commit VARCHAR,
            deleted_at_commit VARCHAR
        );
        CREATE TABLE IF NOT EXISTS edges (
            src_symbol_id VARCHAR,
            dst_symbol_id VARCHAR,
            edge_type VARCHAR,
            src_file VARCHAR,
            dst_file VARCHAR,
            repo VARCHAR,
            commit_hash VARCHAR
        );
    ''')
    print("Database initialized.")

if __name__ == "__main__":
    init_db()
