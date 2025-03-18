
FROM node:23-alpine AS builder
WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm ci

COPY . .

RUN npm run build
FROM node:23-alpine
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/package.json ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/dist ./dist

RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --production; fi

USER appuser

CMD ["npm", "start"]
