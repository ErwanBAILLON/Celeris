FROM node:slim

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
RUN npm run build
RUN npm run build-sw
USER node
CMD ["npm", "start"]
