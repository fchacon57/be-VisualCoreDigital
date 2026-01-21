FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Exponemos el puerto 5000 que es el del backend
EXPOSE 5000

CMD ["npm", "run", "dev"]