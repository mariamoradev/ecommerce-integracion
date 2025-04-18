// consumer.js

const { Kafka } = require('kafkajs');
const { MongoClient } = require('mongodb');

const kafka = new Kafka({
  clientId: 'event-consumer',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'mongo-group' });

const mongoUri = 'mongodb://localhost:27017';
const client = new MongoClient(mongoUri);

const run = async () => {
  await client.connect();
  const db = client.db('event_store');
  const events = db.collection('events');

  await consumer.connect();
  await consumer.subscribe({ topic: 'user-registration', fromBeginning: true });

  console.log('👂 Escuchando eventos de Kafka...');

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value.toString());
      await events.insertOne(event);
      console.log('✅ Evento guardado en MongoDB:', event);
    }
  });
};

run().catch(console.error);
