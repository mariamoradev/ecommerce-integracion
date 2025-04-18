// index.js
require('dotenv').config(); // Carga las variables de entorno desde un archivo .env
const express = require('express');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Importar rutas de la orden
const orderRoutes = require('./routes/orderRoutes');

// Usar las rutas definidas en el enrutador
app.use('/api', orderRoutes);

// Importar conexión a la base de datos
const sequelize = require('../config/database');


// Sincronizar modelos con la base de datos y arrancar el servidor
const PORT = process.env.PORT || 3000;

sequelize.sync()
  .then(() => {
    console.log('Conexión a la base de datos MySQL establecida correctamente.');

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1);
  });
