FROM node:20-slim
WORKDIR /app
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps
COPY . .
RUN npx prisma generate && npm run build
EXPOSE 4000
CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/src/server.js"]
