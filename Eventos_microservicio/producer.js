// producer.js

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'event-producer',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();

  // Simulamos un evento de registro de usuario
  const event = {
    userId: '12345',
    username: 'john_doe',
    email: 'john@example.com',
    createdAt: new Date().toISOString(),
  };

  try {
    await producer.send({
      topic: 'user-registration',
      messages: [
        {
          value: JSON.stringify(event),
        },
      ],
    });
    console.log('✅ Evento enviado a Kafka:', event);
  } catch (error) {
    console.error('❌ Error al enviar el evento:', error);
  }

  await producer.disconnect();
};

run().catch(console.error);
