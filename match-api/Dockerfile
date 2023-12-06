FROM node:21-alpine3.17
WORKDIR /usr/src/app

COPY match-api/package.json .
COPY match-api/package-lock.json* .
RUN npm install

COPY match-api/. .
RUN npm run build
CMD ["npm", "start"]