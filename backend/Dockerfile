FROM node:19.7.0-alpine

RUN apk update

RUN apk add --no-cache bash git

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "run", "start:dev" ]