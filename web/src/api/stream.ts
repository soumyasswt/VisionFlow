import { useState } from 'react';

// The SSE payload types emitted by Phase 5
export type AIStatusEvent = { message: string };
export type AIFocusEvent = { node_ids: string[] };
export type AITokenEvent = { text: string };

export function useAIStream(commitId: string) {
    const [messages, setMessages] = useState<string[]>([]);
    const [status, setStatus] = useState<string>('');
    const [focusedNodes, setFocusedNodes] = useState<string[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);

    const sendQuery = async (prompt: string) => {
        setIsStreaming(true);
        setMessages([]);
        setStatus('Initializing RAG pipeline...');

        try {
            const ENGINE_URL = import.meta.env.VITE_ENGINE_URL || 'http://localhost:8000';
            const response = await fetch(`${ENGINE_URL}/ai/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, commit_id: commitId }),
            });

            if (!response.body) throw new Error("No readable stream");

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');

            let currentSynthesizedText = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // NDJSON SSE format parsing
                const chunk = decoder.decode(value, { stream: true });
                const events = chunk.split('\n\n').filter(Boolean);

                for (const eventBlock of events) {
                    // Parse lines like "event: token", "data: {...}"
                    const lines = eventBlock.split('\n');
                    let eventType = 'message';
                    let dataStr = '{}';

                    for (const line of lines) {
                        if (line.startsWith('event: ')) eventType = line.slice(7).trim();
                        if (line.startsWith('data: ')) dataStr = line.slice(6).trim();
                    }

                    const data = JSON.parse(dataStr);

                    if (eventType === 'status') {
                        setStatus(data.message);
                    } else if (eventType === 'graph_focus') {
                        setFocusedNodes(data.node_ids);
                        // Here we trigger the WebGL Engine Tween directly in the UI component
                    } else if (eventType === 'token') {
                        currentSynthesizedText += data.text;
                        setMessages([currentSynthesizedText]);
                    } else if (eventType === 'done') {
                        setStatus('Complete');
                        setIsStreaming(false);
                    } else if (eventType === 'error') {
                        setStatus(`Error: ${data.message}`);
                        setIsStreaming(false);
                    }
                }
            }
        } catch (err) {
            console.error(err);
            setStatus("Stream failed.");
            setIsStreaming(false);
        }
    };

    return { sendQuery, messages, status, focusedNodes, isStreaming };
}
