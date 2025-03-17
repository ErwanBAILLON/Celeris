# FROM node:slim

# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm install --omit=dev
# COPY . .
# RUN npm run build
# USER node
# CMD ["node", "dist/main.js"]

# Étape 1 : Construction de l’application Next.js
FROM node:23-alpine AS builder
WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm ci

COPY . .

RUN npm run build

# Étape 2 : Image finale pour l’exécution en production
FROM node:23-alpine
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/package.json ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/dist ./

RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --production; fi

USER appuser

EXPOSE 3000

CMD ["npm", "start"]