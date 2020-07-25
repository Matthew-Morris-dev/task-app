FROM node:lts-alpine3.12
WORKDIR /usr/src/app

#install dependencies
COPY ./package*.json ./
RUN npm install

#move app source
COPY ./src .
#Expose port the app will work on
# EXPOSE 3000

#start command
#ENTRYPOINT [ "node", "./app.js" ]

#docker run command in order to launch container with this image
#docker run -it --name tasks --link mongodb:mongodb -p 3000:3000 <your docker image name here> /bin/sh  <-cmd