# api-transfer/Dockerfile

FROM node:18-alpine
WORKDIR /app

# Copiamos package.json y tsconfig.json (si lo usas)
COPY package*.json tsconfig.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto que usa Express
EXPOSE 3000

# Arrancamos con ts-node
CMD ["npx", "ts-node", "src/index.ts"]
