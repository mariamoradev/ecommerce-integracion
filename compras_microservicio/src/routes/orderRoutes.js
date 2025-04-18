// src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Ruta para crear una orden
router.post('/orders', orderController.createOrder);

module.exports = router;
