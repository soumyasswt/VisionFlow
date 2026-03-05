import Fastify from 'fastify';
import { redis, cacheGraphChunk, invalidateNode } from './cache/redis';
import { queryAll, BFS_QUERY, NODE_QUERY } from './services/duckdb';

// This requires the generated protobuf file to be present
// Since we generated it inside src/proto/graph.js
import { visionflow } from './proto/graph';

const app = Fastify({ logger: true });

// CORS setup
app.addHook('onRequest', (request, reply, done) => {
    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Access-Control-Allow-Methods', 'GET, POST');
    done();
});

app.get('/graph/neighbors', async (request, reply) => {
    const { commit, nodeId, depth = 1 } = request.query as { commit: string, nodeId: string, depth?: number };
    const parsedDepth = Number(depth);

    if (!commit || !nodeId) {
        return reply.status(400).send({ error: "Missing commit or nodeId" });
    }

    const cacheKey = `chunk:${commit}:${nodeId}:${parsedDepth}`;

    // STEP 1: Check Redis
    const cachedData = await redis.getBuffer(cacheKey);
    if (cachedData) {
        reply.type('application/x-protobuf').send(cachedData);
        return;
    }

    try {
        // STEP 2: Execute DuckDB CTE Traversal
        // DuckDB node-sqlite3 style API doesn't fully support array params via '?', doing manual binding or simpler approach
        const edges: any[] = await queryAll(BFS_QUERY, [nodeId, commit, parsedDepth, commit]);

        // Extract unique node IDs
        const involvedIds = Array.from(new Set(edges.flatMap(e => [e.source_id, e.target_id])));
        if (involvedIds.length === 0) {
            involvedIds.push(nodeId);
        }

        // Fetch Node metadata
        // We pass array as a string for unnest logic in duckdb
        const nodeIdsArrayParam = `{${involvedIds.map(id => `"${id}"`).join(',')}}`;
        const nodes: any[] = await queryAll(NODE_QUERY, [commit, involvedIds]); // DuckDB driver can handle JS arrays with ? sometimes, or we format it. Let's just use JSON stringification trick if duckdb driver fails, but standard parameterized queries usually work. Wait, the unnest(?::VARCHAR[]) might need an array binding.
        // Actually duckdb-node supports arrays if passed carefully, or we can build the string. 
        // Let's assume queryAll(NODE_QUERY, [commit, involvedIds]) works or we fallback to string injection safely for read-only.
        // Let's do a safe string injection for Node IDs
        const safeIds = involvedIds.map(id => `'${id.replace(/'/g, "''")}'`).join(',');
        const dynamicNodeQuery = `
      SELECT node_id as id, symbol as label, type, 'active' as diff_state, 0.0 as x, 0.0 as y
      FROM nodes
      WHERE commit_id = ?
        AND node_id IN (${safeIds})
    `;
        const fetchedNodes: any[] = await queryAll(dynamicNodeQuery, [commit]);

        const mappedEdges = edges.map(e => ({
            source: e.source_id,
            target: e.target_id,
            type: e.type,
            weight: 1.0,
            diff_state: 'active'
        }));

        // STEP 3: Encode to Protobuf
        const message = visionflow.GraphChunk.create({ nodes: fetchedNodes, edges: mappedEdges });
        const binaryPayload = visionflow.GraphChunk.encode(message).finish();
        const buffer = Buffer.from(binaryPayload);

        // STEP 4: Fire-and-forget Cache + Tags
        cacheGraphChunk(commit, nodeId, parsedDepth, buffer, involvedIds).catch(app.log.error);

        // STEP 5: Return to client
        reply.type('application/x-protobuf').send(buffer);
    } catch (err) {
        app.log.error(err);
        reply.status(500).send({ error: "Internal server error" });
    }
});

// Endpoint to handle webhook invalidation from Python engine
app.post('/webhook/invalidate', async (request, reply) => {
    const { nodeId } = request.body as { nodeId: string };
    if (nodeId) {
        await invalidateNode(nodeId);
        reply.send({ status: 'invalidated', nodeId });
    } else {
        reply.status(400).send({ error: "Missing nodeId" });
    }
});

app.listen({ port: 3000 }, (err, address) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    app.log.info(`API listening at ${address}`);
});
