# Usa la imagen oficial de Node.js LTS
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia package.json y package-lock.json y luego instala dependencias
COPY package.json package-lock.json ./
RUN npm install --production

# Copia el resto del código fuente
COPY . .

# Expone el puerto en el que correrá la aplicación
EXPOSE 3000

# Ejecuta el servicio
CMD ["node", "index.js"]