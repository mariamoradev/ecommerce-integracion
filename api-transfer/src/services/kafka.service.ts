import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'cart-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

export const producer = kafka.producer();

export const connectKafka = async () => {
  await producer.connect();
};
