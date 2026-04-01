const { Kafka } = require('kafkajs');
const { kafkaBroker } = require('../config');

const kafka = new Kafka({
  clientId: 'securecart',
  brokers: [kafkaBroker]
});

module.exports = kafka;
