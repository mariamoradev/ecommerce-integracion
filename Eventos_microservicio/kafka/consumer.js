const { Kafka } = require('kafkajs');
const Event = require('../models/event');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const kafka = new Kafka({
  clientId: 'event-storage-service',
  brokers: [process.env.KAFKA_BROKER]
});

const topics = [
  'user-registration',  // Registro de usuarios
  'product-created',    // Producto creado
  'cart-updates',       // Actualizaciones en el carrito
  'cart-removals',      // Eliminaciones del carrito
  'order-created'       // Orden/pedido creado
];


const consumer = kafka.consumer({ groupId: 'event-storage-group' });

const consume = async () => {
  await consumer.connect();
  for (const topic of topics) {
    await consumer.subscribe({ topic, fromBeginning: true });
  }

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = JSON.parse(message.value.toString());

      const event = new Event({
        eventId: uuidv4(),
        timestamp: new Date(),
        source: value.source,
        topic: topic,
        payload: value.payload,
        snapshot: value.snapshot
      });

      await event.save();
      console.log(`Evento almacenado del tópico ${topic}`);
    }
  });
};

module.exports = consume;
