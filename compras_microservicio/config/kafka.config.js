// config/kafka.config.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'proceso-compra',
  brokers: process.env.KAFKA_BROKERS 
    ? process.env.KAFKA_BROKERS.split(',')
    : ['localhost:9092']
});

// Exportamos el cliente Kafka para usarlo en nuestros productores/consumidores
module.exports = kafka;
