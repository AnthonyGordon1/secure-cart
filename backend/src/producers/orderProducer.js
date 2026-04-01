const kafka = require('../kafka/kafkaClient');

const producer = kafka.producer();

const connectOrderProducer = async () => {
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


module.exports = { connectOrderProducer, produceOrderPlaced };