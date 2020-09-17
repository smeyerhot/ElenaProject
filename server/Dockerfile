FROM node:latest
# Creating app directory
RUN mkdir -p /usr/src/app/server/
WORKDIR /usr/src/app/server/

COPY package*.json ./
RUN npm install
COPY . ./

EXPOSE 5000
# EXPOSE 8989
CMD npm start



