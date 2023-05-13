# FROM node:carbon
# 16Alpiine is a lightwieght 117MB  Alpine Linux image
FROM node:16-alpine

WORKDIR /usr/app

COPY package.json yarn.lock tsconfig.json ctb-service-gApi.json ./
COPY src ./src

#install packages post install will run tsc
RUN yarn

#expose port to listen on in container
EXPOSE 5001

CMD ["yarn","start"]