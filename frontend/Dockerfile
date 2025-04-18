FROM node:23-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm run build-sw
USER node
CMD ["npm", "start"]
