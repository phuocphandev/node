    FROM node:18
    WORKDIR /usr/app
    COPY package*.json ./
    RUN yarn install --legacy-peer-deps
    COPY prisma ./prisma
    RUN yarn prisma generate
    COPY . .
    EXPOSE 8080
    CMD [ "yarn","start:prod" ]