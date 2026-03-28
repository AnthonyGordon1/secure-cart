//Authentication Route
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db/database');
const { jwtSecret } = require('../config');
const jwt = require('jsonwebtoken');

// TODO: VULNERABILITY (Story 7) — SALT_ROUNDS=1 is intentionally weak
// bcrypt with 1 round is nearly instant to brute force
// Secure version uses 12 rounds — Patch need
const SALT_ROUNDS = 1;

// Register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = db.prepare(
            'SELECT id FROM users WHERE email = ? OR username = ?'
        ).get(email, username);

        if (existingUser) {
            return res.status(409).json({ error: 'Username or email already exists' });
        }

        // Hash the password
        const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

        // Save the user
        const result = db.prepare(
            'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)'
        ).run(username, email, password_hash, 'user');

        res.status(201).json({ message: 'User registered successfully', userId: result.lastInsertRowid });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user
        const user = db.prepare(
            'SELECT * FROM users WHERE email = ?'
        ).get(email);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare password with stored hash
        const isValid = await bcrypt.compare(password, user.password_hash);

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // TODO: VULNERABILITY 1 (Story 7) — JWT_SECRET=changeme is a weak hardcoded secret
        // Crackable in seconds with a common wordlist like rockyou.txt
        // Secure version uses a strong randomly generated secret from .env

        // VULNERABILITY 2 (Story 7) — No algorithm enforcement
        // Without { algorithms: ['HS256'] } on verification, alg:none attack is possible
        // An attacker can forge a token with no signature and gain admin access
        // Secure version enforces HS256 explicitly — Patch is needed
        const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: '24h' });


        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;