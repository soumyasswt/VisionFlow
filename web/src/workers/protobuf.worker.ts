// @ts-ignore - The generated protobuf file will be placed here
import { visionflow } from '../proto/graph.js';

self.onmessage = async (e: MessageEvent) => {
    try {
        const { buffer } = e.data;

        // 1. Decode binary protobuf
        const chunk = visionflow.GraphChunk.decode(new Uint8Array(buffer));

        const nodeCount = chunk.nodes.length;
        const edgeCount = chunk.edges.length;

        // 2. Prepare flat TypedArrays for WebGL Instanced Buffers
        const nodePositions = new Float32Array(nodeCount * 2);   // vec2 (x, y)
        const nodeColors = new Float32Array(nodeCount * 3);      // vec3 (r, g, b)
        const nodePickingIds = new Float32Array(nodeCount * 3);  // vec3 (r, g, b) based on ID for FBO

        const edgeSources = new Float32Array(edgeCount * 2);     // vec2 (x, y)
        const edgeTargets = new Float32Array(edgeCount * 2);     // vec2 (x, y)

        const idToIndexMap = new Map<string, number>();

        chunk.nodes.forEach((node: any, i: number) => {
            idToIndexMap.set(node.id, i);

            // Node positions
            nodePositions[i * 2] = node.x;
            nodePositions[i * 2 + 1] = node.y;

            // Node color mapped by diff_state
            let r = 0.5, g = 0.6, b = 0.8; // Default active
            if (node.diffState === 'added') { r = 0.2; g = 0.8; b = 0.3; }
            if (node.diffState === 'deleted') { r = 0.9; g = 0.2; b = 0.2; }
            if (node.diffState === 'impacted') { r = 0.9; g = 0.6; b = 0.1; }

            nodeColors[i * 3] = r;
            nodeColors[i * 3 + 1] = g;
            nodeColors[i * 3 + 2] = b;

            // Unique picking ID logic (i + 1 to avoid 0,0,0 background)
            const pickId = i + 1;
            nodePickingIds[i * 3] = ((pickId >> 16) & 255) / 255.0;
            nodePickingIds[i * 3 + 1] = ((pickId >> 8) & 255) / 255.0;
            nodePickingIds[i * 3 + 2] = (pickId & 255) / 255.0;
        });

        chunk.edges.forEach((edge: any, i: number) => {
            const sourceIdx = idToIndexMap.get(edge.source);
            const targetIdx = idToIndexMap.get(edge.target);

            if (sourceIdx !== undefined && targetIdx !== undefined) {
                edgeSources[i * 2] = nodePositions[sourceIdx * 2];
                edgeSources[i * 2 + 1] = nodePositions[sourceIdx * 2 + 1];

                edgeTargets[i * 2] = nodePositions[targetIdx * 2];
                edgeTargets[i * 2 + 1] = nodePositions[targetIdx * 2 + 1];
            }
        });

        // 3. Transfer buffers with zero-copy explicitly 
        (self as any).postMessage(
            {
                nodes: chunk.nodes, // metadata for UI React lookup
                nodePositions,
                nodeColors,
                nodePickingIds,
                edgeSources,
                edgeTargets
            },
            [
                nodePositions.buffer,
                nodeColors.buffer,
                nodePickingIds.buffer,
                edgeSources.buffer,
                edgeTargets.buffer
            ] as Transferable[]
        );

    } catch (error) {
        console.error("Worker generic error:", error);
    }
};
