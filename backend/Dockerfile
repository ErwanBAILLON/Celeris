FROM node:slim

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
RUN npm run build
USER node
CMD ["node", "dist/main.js"]
