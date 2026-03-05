FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
# Compile TS to JS if needed, or run using ts-node in prod (not recommended, but fine for MVP)
# Better to run `npm run build` and start the JS, assuming there's a build script.
RUN npm install -g typescript ts-node
EXPOSE 3000
CMD ["npx", "ts-node", "src/index.ts"]
