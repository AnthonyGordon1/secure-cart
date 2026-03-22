const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'securecart-consumer',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'order-group' });

const startOrderConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order.placed', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const order = JSON.parse(message.value.toString());
      console.log('Order received from Kafka:', {
        topic,
        partition,
        offset: message.offset,
        order
      });
    }
  });

  console.log('Order consumer listening on order.placed');
};

module.exports = { startOrderConsumer };