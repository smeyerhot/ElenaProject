
# FROM node:13.12.0 as build

# WORKDIR /usr/src/app/client/
# ENV PATH /usr/src/app/node_modules/.bin:$PATH
# COPY package.json . /usr/src/app/client/
# RUN npm install
# COPY . ./
# EXPOSE 3000

# # DO THIS IN PROD
# # RUN npm run build
# # CMD npm run start
# CMD npm run dev

FROM node:latest
# make working directory
WORKDIR /usr/src/app/client/
ENV PATH /usr/src/app/client/node_modules/.bin:$PATH
# copy source files
# COPY . ./
COPY . /usr/src/app/client/

RUN npm install
RUN npm run build
EXPOSE 3000
CMD npm run start