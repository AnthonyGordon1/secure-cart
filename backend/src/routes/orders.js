// orders.js
// Returns order history for the authenticated user.

const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { verifyToken } = require('../middleware/verifyToken');

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

// PATCHED (Story 8) — IDOR ownership check added
// Verifies the requesting user owns the order before returning it
// Returns 403 if user_id does not match the authenticated user
router.get('/order/:id', verifyToken, (req, res) => {
  try {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);

    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Ownership check — user can only access their own orders
    if (order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied — this order does not belong to you' });
    }

    res.json({ ...order, items: JSON.parse(order.items) });
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;