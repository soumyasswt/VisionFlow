import Redis from 'ioredis';

// Connect to local Redis instance
export const redis = new Redis();

export async function cacheGraphChunk(
    commitHash: string,
    nodeId: string,
    depth: number,
    binaryPayload: Buffer,
    involvedNodeIds: string[]
) {
    const cacheKey = `chunk:${commitHash}:${nodeId}:${depth}`;
    const ttl = 3600; // 1 hour

    const pipeline = redis.pipeline();

    // 1. Cache the actual binary protobuf
    pipeline.setex(cacheKey, ttl, binaryPayload);

    // 2. Tag every involved node for O(1) invalidation later
    for (const id of involvedNodeIds) {
        const tagKey = `invalidation:${id}`;
        pipeline.sadd(tagKey, cacheKey);
        pipeline.expire(tagKey, ttl);
    }

    await pipeline.exec();
}

export async function invalidateNode(nodeId: string) {
    const tagKey = `invalidation:${nodeId}`;
    const keysToDelete = await redis.smembers(tagKey);

    if (keysToDelete.length > 0) {
        await redis.del(...keysToDelete, tagKey);
    }
}
