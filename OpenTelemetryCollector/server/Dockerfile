FROM node:12.19.0

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm i

# Install application code
COPY . .
EXPOSE 3000

ENTRYPOINT [ "npm" ]
CMD [ "start" ]
