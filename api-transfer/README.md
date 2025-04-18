# 🛒 Ecommerce Cart Service

Este microservicio maneja el carrito de compras de un sistema de ecommerce. Está desarrollado con Node.js, Express, MySQL y Kafka.

---

## 📦 Requisitos

- Node.js (v16+)
- npm o yarn
- MySQL (puedes usar XAMPP o similar)
- Kafka (en `localhost:9092`)
- Postman o herramienta similar para pruebas

---

## 📁 Estructura del proyecto

```
ecommerce-cart-service/
├── src/
│   ├── controllers/
│   │   └── cartController.ts
│   ├── infrastructure/
│   │   └── config/
│   │       └── kafka.ts
│   ├── models/
│   │   └── db.ts
│   ├── routes/
│   │   └── cartRoutes.ts
│   └── index.ts
├── .env
├── package.json
└── README.md
```

---

## 🔧 Instalación

Clona el proyecto:

```bash
cd ecommerce-cart-service
```

Instala las dependencias:

```bash
npm install
```

---

## ⚙️ Configuración del entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
DB_HOST=localhost
DB_USER=root
DB_PORT=3306
DB_PASSWORD=
DB_NAME=ecommerce_cart
```

> Asegúrate de tener MySQL corriendo en XAMPP y haber creado la base de datos `ecommerce_cart`.

---

## 🗃️ Estructura de la Base de Datos

```sql
CREATE DATABASE IF NOT EXISTS ecommerce_cart;

USE ecommerce_cart;

CREATE TABLE IF NOT EXISTS cart (
  cart_id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_item (
  item_id VARCHAR(255) PRIMARY KEY,
  cart_id VARCHAR(255),
  product_id VARCHAR(255),
  quantity INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE
);
```

---

## 🚀 Ejecución del proyecto

Para ejecutar el servicio, usa:

```bash
npx ts-node src/index.ts
```

---

## ✅ Al iniciar correctamente verás:

```
Kafka conectado exitosamente
Kafka está corriendo en: localhost:9092
Servidor API corriendo en http://localhost:3000
```

---

## 📡 Endpoints disponibles

| Método | Ruta                  | Descripción                          |
|--------|-----------------------|--------------------------------------|
| POST   | `/items`              | Agrega un producto al carrito        |
| DELETE | `/items/:productId`   | Elimina un producto del carrito      |

---

## 📬 Ejemplo de uso

### POST `/items`

**Body:**

```json
{
  "userId": "abcde-12345",
  "productId": "123",
  "quantity": 2
}
```

### DELETE `/items/:productId`

**URL:**

```
DELETE http://localhost:3000/items/123
```

**Body:**

```json
{
  "userId": "abcde-12345"
}
```

---

## 💡 Notas

- Asegúrate de que Kafka esté corriendo en `localhost:9092`
- Este microservicio puede integrarse con otros como el de `catalog` o `order`
```
