FROM node:21-alpine3.17
WORKDIR /usr/src/app

COPY user-api/package.json .
COPY user-api/package-lock.json* .
RUN npm install

COPY user-api/. .
RUN npm run build
CMD ["npm", "start"]