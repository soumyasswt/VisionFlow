import * as duckdb from 'duckdb';
import * as path from 'path';

const dbPath = path.resolve(__dirname, '../../../engine/visionflow.duckdb');
const db = new duckdb.Database(dbPath);

export function queryAll<T>(query: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
        db.all(query, ...params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows as T[]);
        });
    });
}

export const BFS_QUERY = `
WITH RECURSIVE traverse AS (
    SELECT target_id, source_id, edge_type as type, 1 as depth
    FROM edges
    WHERE source_id = ?
      AND commit_id = ?
    
    UNION ALL
    
    SELECT e.target_id, e.source_id, e.edge_type as type, t.depth + 1
    FROM edges e
    INNER JOIN traverse t ON e.source_id = t.target_id
    WHERE t.depth < ?
      AND e.commit_id = ?
)
SELECT * FROM traverse;
`;

export const NODE_QUERY = `
SELECT node_id as id, symbol as label, type, 'active' as diff_state
FROM nodes
WHERE commit_id = ?
  AND node_id IN (SELECT unnest(?::VARCHAR[]))
`;
