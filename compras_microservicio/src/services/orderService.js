// src/services/orderService.js
const sequelize = require('../../config/database');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const kafkaProducer = require('./kafkaProducer');

exports.createOrder = async ({ userId, items }) => {
  const total = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const transaction = await sequelize.transaction();

  try {
    // Crear la orden en la base de datos
    const order = await Order.create({ userId, total }, { transaction });
    
    // Insertar los items de la orden
    await Promise.all(
      items.map(item =>
        OrderItem.create(
          {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          },
          { transaction }
        )
      )
    );
    
    // Preparar el evento para Kafka
    const orderCreatedEvent = {
      eventId: `order_${order.id}_${Date.now()}`,
      timestamp: new Date().toISOString(),
      source: 'OrderService',
      topic: 'order-created',
      payload: {
        orderId: order.id,
        userId,
        total,
        items
      }
    };

    // Intentar publicar el evento en Kafka; en caso de error,
    // se realiza rollback antes de lanzar la excepción.
    try {
      await kafkaProducer.publishEvent('order-created', orderCreatedEvent);
    } catch (kafkaError) {
      await transaction.rollback();
      throw kafkaError;
    }
    
    // Si llegamos hasta acá sin errores, se confirma la transacción
    await transaction.commit();
    
    // Retornar la factura como respuesta
    return {
      to: 'juan@example.com',
      subject: `Factura #ORDER${order.id}`,
      content: `Total: $${total.toFixed(2)}`
    };

  } catch (error) {
    // Si la transacción no finalizó, realizamos rollback
    if (!transaction.finished) {
      await transaction.rollback();
    }
    throw error;
  }
};
