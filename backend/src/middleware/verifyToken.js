const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');


const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, jwtSecret, { algorithms: ['HS256'] }, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Invalid or rejected token' });
        req.user = decoded;
        next();
    });
};

module.exports = { verifyToken };
