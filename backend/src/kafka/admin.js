const kafka = require('./kafkaClient');

const admin = kafka.admin();

const createTopics = async () => {
  await admin.connect();

  await admin.createTopics({
    waitForLeaders: true,
    topics: [
      { topic: 'order.placed', numPartitions: 1, replicationFactor: 1 },
      { topic: 'order.processed', numPartitions: 1, replicationFactor: 1 },
      { topic: 'user.activity', numPartitions: 1, replicationFactor: 1 }
    ]
  });

  console.log('Kafka topics created: order.placed, order.processed, user.activity');
  await admin.disconnect();
};

module.exports = { createTopics };