import subprocess
from typing import List, Tuple, Set
import duckdb

class GitDiffEngine:
    def __init__(self, repo_path: str, con: duckdb.DuckDBPyConnection):
        self.repo_path = repo_path
        self.con = con

    def get_changed_files(self, base_commit: str, head_commit: str) -> List[Tuple[str, str]]:
        """Returns [('M', 'path/to/file'), ('A', 'path/to/new_file'), ...]"""
        try:
            cmd = ['git', 'diff', '--name-status', base_commit, head_commit]
            result = subprocess.run(cmd, cwd=self.repo_path, capture_output=True, text=True, check=True)
            changes = []
            for line in result.stdout.strip().split('\n'):
                if not line: continue
                parts = line.split('\t')
                if len(parts) >= 2:
                    changes.append((parts[0], parts[1]))
            return changes
        except subprocess.CalledProcessError as e:
            print(f"Git diff failed: {e}")
            return []

    def get_blast_radius(self, changed_files: List[str], repo: str) -> Set[str]:
        """Queries file_dependencies table to find all dependent files."""
        if not changed_files:
            return set()
            
        file_list = ", ".join([f"'{f}'" for f in changed_files])
        query = f"""
            SELECT src_file 
            FROM file_dependencies
            WHERE dst_file IN ({file_list}) AND repo = '{repo}'
        """
        results = self.con.execute(query).fetchall()
        impacted = {row[0] for row in results}
        
        # Add inheritance propagation
        # (Simplified: in reality this uses the inheritance_index joined strictly with nodes)
        
        return impacted.union(set(changed_files))
