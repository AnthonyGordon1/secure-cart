const express = require('express');
const router = express.Router();
const { produceOrderPlaced } = require('../producers/orderProducer');

router.post('/', async (req, res) => {
  try {
    const orderData = {
      orderId: Date.now(),
      userId: req.body.userId,
      items: req.body.items,
      total: req.body.total,
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