const express = require('express');
const cors = require('cors');
const { createTopics } = require('./kafka/admin');
const { connectProducer } = require('./producers/orderProducer');
const { startOrderConsumer } = require('./consumers/orderConsumer');
const checkoutRouter = require('./routes/checkout');

require('dotenv').config();


//Creating the app
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//Health check 
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/checkout', checkoutRouter);


app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await createTopics();
  await connectProducer();
  await startOrderConsumer();
});








