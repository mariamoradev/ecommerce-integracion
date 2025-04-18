# Proceso de Compra - Microservicio Dockerizado

Este microservicio implementa el flujo de **Proceso de Compra** para un e-commerce:
1. Recibe un POST con datos de orden.
2. Persiste en MySQL (`orders` y `order_items`).
3. Publica en Kafka (`order-created`).
4. Devuelve JSON con factura.

## 📋 Contenido del repositorio

- `Dockerfile`             → Definición de la imagen Docker.
- `scripts/init.sql`       → Script SQL para crear la base de datos y tablas.
- `config/database.js`     → Conexión a MySQL (usado por Sequelize).
- `config/kafka.config.js` → Configuración de Kafka.
- `src/`                  → Código fuente (controllers, services, models, routes).
- `index.js`              → Punto de entrada de la aplicación.

## 🔧 Requisitos previos

- Docker y Docker Compose instalados.
- Acceso a un broker Kafka en `127.0.0.1:9092` (o cambiar en el `.env`).
- MySQL accesible (local o remota).

## ⚙️ Configuración de entorno

1. Crea un archivo `.env` en la raíz con:
   ```env
   DB_HOST=localhost
   DB_NAME=ecommerce_orders
   DB_USER=root
   DB_PASSWORD=tu_password
   KAFKA_CLIENT_ID=proceso-compra
   KAFKA_BROKERS=127.0.0.1:9092
   PORT=3000