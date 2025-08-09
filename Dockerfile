FROM node:slim

WORKDIR /kigali-talent-backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD [ "npm", "start" ]
