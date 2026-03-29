// orders.js
// Returns order history for the authenticated user.

const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/orders/:userId — returns all orders for a user
router.get('/:userId', (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
    `).all(req.params.userId);

    // Parse items JSON string back to array for each order
    const parsed = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items)
    }));

    res.json(parsed);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;