FROM node:21-alpine3.17
WORKDIR /usr/src/app

COPY creature-api/package.json .
COPY creature-api/package-lock.json* .
RUN npm install

COPY creature-api/. .
RUN npm run build
CMD ["npm", "start"]