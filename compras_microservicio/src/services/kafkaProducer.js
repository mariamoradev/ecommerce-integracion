// src/services/kafkaProducer.js
const kafka = require('../../config/kafka.config');
const producer = kafka.producer();

let isProducerConnected = false;

const connectProducer = async () => {
  if (!isProducerConnected) {
    try {
      await producer.connect();
      console.log('✅ Kafka Producer conectado');
      isProducerConnected = true;
    } catch (error) {
      console.error('❌ Error al conectar con Kafka:', error);
      throw error;
    }
  }
};

exports.publishEvent = async (topic, event) => {
  try {
    await connectProducer();
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(event) }]
    });
    console.log(`📤 Evento publicado en el tópico "${topic}"`);
  } catch (error) {
    console.error(`❌ Error publicando el evento en "${topic}":`, error);
    throw error;
  }
};
