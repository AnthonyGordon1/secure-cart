// products.js
// Returns all products from the database.
// This route is protected — requires a valid JWT token.

const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/products — returns all products
router.get('/', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products').all();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/search?q= — search products by name
router.get('/search', (req, res) => {
  try {
    const query = req.query.q || '';
    console.log('Search query received:', query);
    const products = db.prepare(
      'SELECT * FROM products WHERE name LIKE ?'
    ).all(`%${query}%`);
    res.json(products);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

// GET /api/products/:id — returns a single product
router.get('/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;