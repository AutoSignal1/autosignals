FROM node:16-alpine as development

WORKDIR /app/user
COPY package*.json ./
# RUN npm install -g yarn
RUN apk add --update python3 make g++\
    && rm -rf /var/cache/apk/*
RUN yarn install
COPY . .
RUN yarn run build

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app/user
COPY package*.json ./
COPY .env .
RUN apk add --update python3 make g++\
    && rm -rf /var/cache/apk/*
# RUN npm install -g yarn --force
RUN yarn install --only=prod

COPY . .

COPY --from=development /app/user/dist ./dist

EXPOSE 5050

CMD yarn run start:prod