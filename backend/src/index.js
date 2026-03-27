const express = require('express');
const cors = require('cors');

const { createTopics } = require('./kafka/admin');
const { connectProducer } = require('./producers/orderProducer');
const { startOrderConsumer } = require('./consumers/orderConsumer');
const { createTables } = require('./db/schema');
const { seedProducts } = require('./db/seed');

const checkoutRouter = require('./routes/checkout');
const authRouter = require('./routes/auth');const productsRouter = require('./routes/products');

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
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);


app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  createTables();
  seedProducts();
  await createTopics();
  await connectProducer();
  await startOrderConsumer();
});








