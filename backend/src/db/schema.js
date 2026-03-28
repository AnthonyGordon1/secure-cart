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

  // Products table — stores all available items in the store
  db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    image_url TEXT
  );
`);
  console.log('Product Table created successfully');

  // Orders table — stores placed orders linked to users
  db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    items TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);
  console.log('Order Table created successfully');

  console.log('All Tables created successfully');
};

// Export a function that runs all the table creation so index.js can call it on startup
module.exports = { createTables }; 