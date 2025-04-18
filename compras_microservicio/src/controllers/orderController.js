// src/controllers/orderController.js
const orderService = require('../services/orderService');

exports.createOrder = async (req, res) => {
  try {
    // Se extrae la información enviada en el body del request
    const { userId, items } = req.body;
    
    // Se podría agregar validación adicional aquí utilizando utilidades de validación
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Datos de orden inválidos' });
    }
    
    // Se invoca el servicio para crear la orden, calcular totales y emitir eventos de Kafka
    const orderResponse = await orderService.createOrder({ userId, items });
    
    // Se retorna la respuesta con el detalle de la orden
    return res.status(201).json(orderResponse);
  } catch (error) {
    console.error('Error al crear la orden:', error);
    return res.status(500).json({ message: 'Error al crear la orden', error: error.message });
  }
};
