import duckdb

class GraphIngester:
    def __init__(self, con: duckdb.DuckDBPyConnection):
        self.con = con

    def apply_diff_cleanup(self, dirty_files: set):
        """
        Bidirectional edge cleanup to prevent phantom/ghost edges.
        """
        if not dirty_files:
            return

        file_list = ", ".join([f"'{f}'" for f in dirty_files])
        
        # Bidirectional Edge Deletion
        self.con.execute(f"""
            DELETE FROM edges 
            WHERE source_id IN (SELECT node_id FROM nodes WHERE file_id IN ({file_list}))
               OR target_id IN (SELECT node_id FROM nodes WHERE file_id IN ({file_list}))
        """)
        
        # Delete reverse dependencies involving dirty files
        self.con.execute(f"""
            DELETE FROM file_dependencies
            WHERE src_file IN ({file_list}) OR dst_file IN ({file_list})
        """)

    def insert_scip_data(self, scip_paths: list[str], commit_id: str):
        """
        Given the SCIP protobufs, parse and insert the modified nodes and edges.
        """
        for path in scip_paths:
            print(f"Deserializing SCIP index from {path} and inserting into DuckDB.")
            # Prototype logic for DuckDB bulk insert using prepared statements goes here
