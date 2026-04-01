const express = require('express');
const router = express.Router();
const { produceOrderPlaced } = require('../producers/orderProducer');
const db = require('../db/database');

router.post('/', async (req, res) => {
  try {
    const { userId, items, total } = req.body;

    // Save order to database before producing Kafka event
    const result = db.prepare(`
  INSERT INTO orders (user_id, items, total, status)
  VALUES (?, ?, ?, 'pending')
`).run(userId, JSON.stringify(items), total);

    const orderData = {
      orderId: result.lastInsertRowid,
      userId,
      items,
      total,
      timestamp: new Date().toISOString()
    };

    await produceOrderPlaced(orderData);

    res.json({ message: 'Order placed successfully', order: orderData });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

module.exports = router;