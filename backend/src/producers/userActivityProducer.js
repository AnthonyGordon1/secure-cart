// userActivityProducer.js
// Produces user activity events to the user.activity Kafka topic.

const kafka = require('../kafka/kafkaClient');

const producer = kafka.producer();

const connectActivityProducer = async () => {
  await producer.connect();
  console.log('User activity producer connected');
};

const produceUserActivity = async (activityData) => {
  await producer.send({
    topic: 'user.activity',
    messages: [
      {
        key: String(activityData.userId),
        value: JSON.stringify(activityData)
      }
    ]
  });
  console.log('Event produced to user.activity:', activityData);
};

module.exports = { connectActivityProducer, produceUserActivity };