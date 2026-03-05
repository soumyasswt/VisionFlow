import React, { useEffect, useRef, useState } from 'react';
import { WebGLController } from '../renderer/WebGLController';
import { useAIStream } from '../api/stream';

export const GraphCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const webGLRef = useRef<WebGLController | null>(null);
    const workerRef = useRef<Worker | null>(null);
    const [hoveredNode, setHoveredNode] = useState<number>(0);

    // Initialize SSE Hook
    const { sendQuery, status, messages, focusedNodes, isStreaming } = useAIStream('latest');

    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
            webGLRef.current = new WebGLController(canvasRef.current);
        }

        // Set up rapid FBO hover polling sync into a throttled react state for tooltips
        const interval = setInterval(() => {
            if (webGLRef.current) {
                const hId = webGLRef.current.hoveredId;
                setHoveredNode(hId);
            }
        }, 100);

        // Initialize Web Worker
        workerRef.current = new Worker(new URL('../workers/protobuf.worker.ts', import.meta.url), { type: 'module' });

        workerRef.current.onmessage = (e) => {
            const { nodePositions, nodeColors, nodePickingIds } = e.data;
            if (webGLRef.current) {
                webGLRef.current.updateGraphData({ nodePositions, nodeColors, nodePickingIds });
            }
        };

        return () => {
            clearInterval(interval);
            webGLRef.current?.destroy();
            workerRef.current?.terminate();
        };
    }, []);

    // Bridge SSE Focus Command to WebGL Engine
    useEffect(() => {
        if (focusedNodes.length > 0 && webGLRef.current) {
            // In reality we resolve string IDs to buffer indices, mock index for tween demo
            webGLRef.current.focusNodesByIndex([0, 1]);
        }
    }, [focusedNodes]);

    const handleQuery = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const q = fd.get('query') as string;
        if (q) sendQuery(q);
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: '#141419' }}>
            <canvas ref={canvasRef} style={{ display: 'block' }} />

            {/* UI Overlay */}
            <div style={{ position: 'absolute', top: 20, left: 20, width: 350, color: 'white', fontFamily: 'sans-serif' }}>
                <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: 600 }}>VisionFlow</h2>

                <form onSubmit={handleQuery} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                    <input
                        name="query"
                        placeholder="Ask about the architecture..."
                        style={{ flex: 1, padding: '8px 12px', borderRadius: 4, border: 'none', background: '#2C2D35', color: 'white' }}
                        disabled={isStreaming}
                    />
                    <button type="submit" style={{ padding: '8px 16px', borderRadius: 4, border: 'none', background: '#4A6FFF', color: 'white', cursor: 'pointer' }}>
                        Ask
                    </button>
                </form>

                {status && (
                    <div style={{ background: 'rgba(0,0,0,0.5)', padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 10 }}>
                        <span style={{ color: '#888' }}>System Status:</span> {status}
                    </div>
                )}

                {messages.length > 0 && (
                    <div style={{ background: 'rgba(0,0,0,0.7)', padding: 16, borderRadius: 8, border: '1px solid #333', fontSize: 14, lineHeight: 1.5 }}>
                        {messages[0]}
                    </div>
                )}
            </div>

            {hoveredNode > 0 && (
                <div style={{ position: 'absolute', bottom: 20, left: 20, color: '#aaa', fontSize: 12 }}>
                    Hovering internal index: {hoveredNode}
                </div>
            )}
        </div>
    );
};
