# filename: backend/Dockerfile
FROM node:20

RUN apt-get update && apt-get install -y python3 make g++

WORKDIR /app
COPY package*.json ./

RUN npm install
RUN npm rebuild sqlite3 --build-from-source

COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "run", "dev"]