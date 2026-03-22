const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'securecart',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
  console.log('Kafka producer connected');
};

const produceOrderPlaced = async (orderData) => {
  await producer.send({
    topic: 'order.placed',
    messages: [
      {
        key: String(orderData.orderId),
        value: JSON.stringify(orderData)
      }
    ]
  });
  console.log('Event produced to order.placed:', orderData);
};


module.exports = { connectProducer, produceOrderPlaced };