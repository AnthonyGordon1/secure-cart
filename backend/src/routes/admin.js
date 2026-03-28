// admin.js
// Admin-only routes listing all users and orders.
// INTENTIONALLY has no role check — vulnerability for Story 8 (Broken Access Control)

const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/admin/users — returns all users
// VULNERABLE: no role check, any authenticated user can access this
router.get('/users', (req, res) => {
    try {
        // INTENTIONALLY VULNERABLE — returns password_hash (Story 10 — Excessive Data Exposure)
        const users = db.prepare('SELECT * FROM users').all();
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// GET /api/admin/orders — returns all orders across all users
// VULNERABLE: no role check, any authenticated user can access this
router.get('/orders', (req, res) => {
    try {
        const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
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