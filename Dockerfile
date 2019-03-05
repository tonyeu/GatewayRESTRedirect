FROM node:10.13-alpine
RUN apk add --no-cache bash
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production --silent 
COPY ./dist ./dist
EXPOSE 12345
CMD node ./dist/main.js