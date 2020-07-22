FROM node:current-slim
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
EXPOSE 4999
CMD ["npm", "start"]