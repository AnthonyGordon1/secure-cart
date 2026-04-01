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

// GET /api/orders/order/:id — returns a single order by ID
// Ownership check enforced — users can only access their own orders
// VULNERABILITY (Story 8) — Insecure Direct Object Reference (IDOR)
// No ownership check on order lookup — any authenticated user can access any order by ID
// Attacker can enumerate all orders by iterating order IDs
// Secure version: verify req.user.id === order.user_id before returning — see patch/idor
router.get('/order/:id', (req, res) => {
  try {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ ...order, items: JSON.parse(order.items) });
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

module.exports = router;