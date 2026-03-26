//the connection file
const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

// Read the database file path from .env
const dbPath = process.env.DB_PATH || './database.sqlite';

// Open a connection to that file using better-sqlite3
const db = new Database(path.resolve(dbPath));
console.log(`Database connected at ${dbPath}`);

// Export that connection so other files can use it
module.exports = db;