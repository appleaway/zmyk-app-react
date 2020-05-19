FROM node:12.16.1-stretch-slim

LABEL maintainer="785606282@qq.com"

COPY . /app/

WORKDIR /app

RUN yarn install && npm install pm2 -g

EXPOSE 3000

CMD ["pm2-runtime", "app.js"]
