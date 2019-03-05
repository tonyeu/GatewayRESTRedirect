FROM node:10.13-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 10000
CMD node ./dist/main.js