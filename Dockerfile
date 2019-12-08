FROM node:12

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app/

COPY package.json ./

COPY package-lock.json ./
COPY . ./

RUN npm install

RUN npm run build:server

RUN npm run build:client

EXPOSE 3001

CMD ["node", "dist/main-bundle.js"]
