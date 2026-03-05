FROM node:20-slim

# Install system dependencies for native modules (DuckDB)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./

# Install all dependencies (including devDeps for build/ts-node)
RUN npm install

COPY . .

# Expose the API port
EXPOSE 3000

# Start with ts-node for now (MVP simple)
CMD ["npx", "ts-node", "src/index.ts"]
