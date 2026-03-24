require('dotenv').config({ 
  path: require('path').resolve(__dirname, '../../.env') 
});

module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  dbPath: process.env.DB_PATH || './database.sqlite',
  kafkaBroker: process.env.KAFKA_BROKER || 'localhost:9092',
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1'
  }
};