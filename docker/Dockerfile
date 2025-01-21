FROM node:20-alpine

RUN apk update && apk add git && rm -rf /var/cache/apk/*

ENV NODE_ENV=production

RUN mkdir -p /app/public/images
WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production

COPY . .

ENV NAMESPACE=FUSIONBRAIN
ENV SERVICEDIR=services

CMD ["yarn", "start"]