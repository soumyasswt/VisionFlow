import duckdb
from .diff.git_diff import GitDiffEngine
from .indexers.dispatcher import IndexDispatcher
from .graph_builder.ingester import GraphIngester
from .graph_builder.schema import init_schema

class VisionFlowOrchestrator:
    def __init__(self, repo_path: str, db_path: str = 'visionflow.duckdb'):
        self.repo_path = repo_path
        self.con = duckdb.connect(db_path)
        init_schema(self.con)
        
        self.diff_engine = GitDiffEngine(repo_path, self.con)
        self.dispatcher = IndexDispatcher(repo_path)
        self.ingester = GraphIngester(self.con)

    def process_commit(self, base_commit: str, head_commit: str):
        print(f"Processing commit delta: {base_commit} -> {head_commit}")
        
        # 1. Delta Trigger
        changes = self.diff_engine.get_changed_files(base_commit, head_commit)
        if not changes:
            print("No changes detected.")
            return

        dirty_files = [f for _, f in changes]
        
        # 2. Blast Radius Query
        impacted_files = self.diff_engine.get_blast_radius(dirty_files, repo="local")
        print(f"Blast radius expanded dirty files from {len(dirty_files)} to {len(impacted_files)}")
        
        # Bin files by extension for the dispatcher
        file_batches = {"python": [], "typescript": []}
        for f in impacted_files:
            if f.endswith('.py'):
                file_batches["python"].append(f)
            elif f.endswith('.ts') or f.endswith('.js') or f.endswith('.tsx') or f.endswith('.jsx'):
                file_batches["typescript"].append(f)

        # 3. Sparse SCIP Run
        scip_results = self.dispatcher.dispatch_parallel({k: v for k, v in file_batches.items() if v})
        
        # 4. Graph Merge Logic
        self.ingester.apply_diff_cleanup(impacted_files)
        scip_paths = list(scip_results.values())
        self.ingester.insert_scip_data(scip_paths, head_commit)
        
        print(f"Commit {head_commit} successfully ingested.")
