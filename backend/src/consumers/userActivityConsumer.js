// userActivityConsumer.js
// Consumes events from the user.activity Kafka topic and logs them.

const { Kafka } = require('kafkajs');
const { kafkaBroker } = require('../config');

const kafka = new Kafka({
    clientId: 'securecart-consumer',
    brokers: [kafkaBroker || 'localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'user-activity-group' });

const startUserActivityConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'user.activity', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const activityData = JSON.parse(message.value.toString());
            console.log('User activity event received:', activityData);
        }
    });

    console.log('User activity consumer listening on user.activity');
};

module.exports = { startUserActivityConsumer };