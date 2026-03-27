// seed.js
// Populates the database with test data.
// Checks for existing data before inserting to avoid duplicates.

const db = require('./database');

const seedProducts = () => {
  // Check if products already exist to avoid duplicate seeding
  const existing = db.prepare('SELECT COUNT(*) as count FROM products').get();

  if (existing.count > 0) {
    console.log('Products already seeded — skipping');
    return;
  }

  const insert = db.prepare(`
    INSERT INTO products (name, description, price, image_url)
    VALUES (?, ?, ?, ?)
  `);

  const products = [
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancellation with 30-hour battery life. Crystal clear hands-free calling and Alexa voice control built in.',
    price: 349.99,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
  },
  {
    name: 'Apple AirPods Pro 2nd Gen',
    description: 'Active noise cancellation, transparency mode, and personalized spatial audio. MagSafe charging case with up to 30 hours total battery.',
    price: 249.00,
    image_url: 'https://images.unsplash.com/photo-1606741965326-cb990ae01bb2?w=400&h=300&fit=crop'
  },
  {
    name: 'Samsung 49" Odyssey OLED G9',
    description: 'Dual QHD curved OLED gaming monitor with 240Hz refresh rate and 0.03ms response time. Immersive 1000R curvature.',
    price: 1299.99,
    image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop'
  },
  {
    name: 'Keychron Q1 Pro Keyboard',
    description: 'Wireless mechanical keyboard with hot-swappable switches, gasket-mounted design, and aircraft-grade aluminum body.',
    price: 199.00,
    image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop'
  },
  {
    name: 'Logitech MX Master 3S Mouse',
    description: 'Ultra-fast MagSpeed electromagnetic scrolling, 8K DPI sensor, and quiet clicks. Works across multiple devices seamlessly.',
    price: 99.99,
    image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop'
  },
  {
    name: 'LG 27" UltraFine 5K Display',
    description: 'P3 wide color gamut with True Tone technology. Thunderbolt 3 connectivity delivers 94W of power to your laptop.',
    price: 1299.00,
    image_url: 'https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?w=400&h=300&fit=crop'
  },
  {
    name: 'Elgato Stream Deck MK.2',
    description: '15 customizable LCD keys for instant access to actions across your workflow. Drag and drop setup, infinite possibilities.',
    price: 149.99,
    image_url: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=300&fit=crop'
  },
  {
    name: 'Peak Design Everyday Backpack 20L',
    description: 'The most versatile everyday carry backpack. Weatherproof, origami-inspired organization, and lifetime guarantee.',
    price: 299.95,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop'
  }
];

  // Insert all products in a transaction for atomicity
  const insertMany = db.transaction((products) => {
    for (const product of products) {
      insert.run(product.name, product.description, product.price, product.image_url);
    }
  });

  insertMany(products);
  console.log(`Seeded ${products.length} products successfully`);
};

module.exports = { seedProducts };