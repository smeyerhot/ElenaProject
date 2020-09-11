FROM node:latest
# Creating app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY .env /usr/src/app

RUN npm install
EXPOSE 5000
# EXPOSE 8989
CMD ["npm", "run", "dev"]