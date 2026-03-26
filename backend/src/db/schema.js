/* where all your table definitions live
creates all your tables */
// Import the database connection from database.js
const db = require('./database');

// Create all your tables if they do not exist
const createTables = () => {
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user'
    );
  `);
    console.log('User Table created successfully');

    console.log('Tables created successfully');
};

// Export a function that runs all the table creation so index.js can call it on startup
module.exports = { createTables }; 