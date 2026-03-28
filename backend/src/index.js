const express = require('express');
const cors = require('cors');

const { createTopics } = require('./kafka/admin');
const { connectOrderProducer } = require('./producers/orderProducer');
const { connectActivityProducer } = require('./producers/userActivityProducer');
const { startOrderConsumer } = require('./consumers/orderConsumer');
const { startUserActivityConsumer } = require('./consumers/userActivityConsumer');
const { createTables } = require('./db/schema');
const { seedProducts, seedAdmin } = require('./db/seed');

const checkoutRouter = require('./routes/checkout');
const authRouter = require('./routes/auth'); 
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const adminRouter = require('./routes/admin');

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
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);


app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  createTables();
  seedProducts();
  seedAdmin();
  await createTopics();
  await connectOrderProducer();
  await connectActivityProducer();
  await startOrderConsumer();
  await startUserActivityConsumer();
});








