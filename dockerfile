FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install -g ts-node nodemon

COPY tsconfig.json ./
COPY src ./src

COPY . .

EXPOSE 5002

CMD ["npm", "start"]