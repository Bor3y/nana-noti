
FROM node:14.17.6-alpine

RUN apk update && apk add git yarn python gcc g++ make bash && rm -rf /var/cache/apk/*

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
