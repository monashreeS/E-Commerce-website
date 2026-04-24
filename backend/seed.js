
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

const sampleProducts = [
  { name: 'Dell Inspiron 15', price: 55000, category: 'Laptops', image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600', description: 'Dell Inspiron 15 designed for students & professionals needing performance and reliability.', features: ['11th Gen Intel Core i5', '8GB RAM | 512GB SSD', '15.6\" FHD Display', 'Windows 11 Home', '1 Year Warranty'], stock: 15, rating: 4.5, reviews: 120, branchRecommendation: ['CSE', 'IT', 'AIDS', 'ECE'], featured: true },
  { name: 'MacBook Air M2', price: 114990, category: 'Laptops', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', description: 'Apple MacBook Air with M2 chip, stunning display, all-day battery life.', features: ['Apple M2 Chip', '8GB RAM | 256GB SSD', '13.6\" Liquid Retina', 'macOS Sonoma'], stock: 8, rating: 4.8, reviews: 350, branchRecommendation: ['CSE', 'IT', 'AIDS'], featured: true },
  { name: 'HP Pavilion 15', price: 65990, category: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600', description: 'Premium everyday laptop for students.', features: ['Intel Core i5 12th Gen', '16GB RAM | 512GB SSD', '15.6\" FHD IPS'], stock: 12, rating: 4.3, reviews: 95, branchRecommendation: ['ALL'], featured: true },
  { name: 'Lenovo IdeaPad Slim 3', price: 42990, category: 'Laptops', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600', description: 'Affordable powerhouse for engineering tasks.', features: ['Ryzen 5', '8GB RAM', '512GB SSD'], stock: 20, rating: 4.2, reviews: 78, branchRecommendation: ['ECE', 'EEE', 'ME'] },
  { name: 'ASUS ROG Strix G16', price: 124990, category: 'Laptops', image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600', description: 'Gaming-grade laptop for heavy simulations.', features: ['Intel i7 13th Gen', '16GB RAM', 'RTX 4060'], stock: 5, rating: 4.7, reviews: 210, branchRecommendation: ['CSE', 'ME'] },

  { name: 'iPhone 14', price: 59990, category: 'Mobiles', image: 'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=600', description: 'Apple iPhone 14 with A15 Bionic chip.', features: ['6.1\" OLED', 'A15 Bionic', 'Dual 12MP Camera'], stock: 18, rating: 4.6, reviews: 500, branchRecommendation: ['ALL'], featured: true },
  { name: 'Samsung Galaxy S23', price: 64999, category: 'Mobiles', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600', description: 'Flagship Samsung phone.', features: ['Snapdragon 8 Gen 2', '8GB RAM', '256GB Storage'], stock: 10, rating: 4.5, reviews: 320, branchRecommendation: ['ALL'] },
  { name: 'OnePlus 12R', price: 39999, category: 'Mobiles', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600', description: 'Flagship killer with great specs.', features: ['Snapdragon 8 Gen 2', '120Hz AMOLED'], stock: 25, rating: 4.4, reviews: 180, branchRecommendation: ['ALL'] },

  { name: 'Sony WH-1000XM5', price: 24990, category: 'Accessories', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600', description: 'Industry-leading noise cancellation headphones.', features: ['Active Noise Cancelling', '30h Battery', 'Bluetooth 5.2'], stock: 30, rating: 4.8, reviews: 700, branchRecommendation: ['ALL'], featured: true },
  { name: 'Boat Airdopes 141', price: 1299, category: 'Accessories', image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600', description: 'Affordable TWS earbuds.', features: ['42h Playtime', 'IPX4', 'Beast Mode'], stock: 100, rating: 4.2, reviews: 2100, branchRecommendation: ['ALL'] },
  { name: 'Logitech MX Master 3S', price: 9995, category: 'Accessories', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600', description: 'Precision wireless mouse.', features: ['8000 DPI', 'USB-C Charging', 'Multi-device'], stock: 40, rating: 4.7, reviews: 400, branchRecommendation: ['CSE', 'IT', 'AIDS'] },
  { name: 'Mechanical Keyboard RGB', price: 3499, category: 'Accessories', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600', description: 'RGB mechanical keyboard for coders & gamers.', features: ['Blue Switches', 'RGB Backlight', 'Anti-ghosting'], stock: 50, rating: 4.4, reviews: 230, branchRecommendation: ['CSE', 'IT'] },
  { name: 'SanDisk 1TB SSD', price: 8499, category: 'Accessories', image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600', description: 'Portable NVMe SSD.', features: ['1050 MB/s Read', 'USB-C', 'Shock Resistant'], stock: 60, rating: 4.6, reviews: 520, branchRecommendation: ['ALL'] },
  { name: 'SSD 512GB Internal', price: 4999, category: 'Accessories', image: 'https://images.unsplash.com/photo-1628557044797-f21a177c37ec?w=600', description: 'Internal NVMe SSD for PC upgrades.', features: ['NVMe PCIe', '3500 MB/s'], stock: 70, rating: 4.5, reviews: 180, branchRecommendation: ['CSE', 'ECE'] },
  { name: 'Wireless Mouse', price: 899, category: 'Accessories', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600', description: 'Budget wireless mouse.', features: ['1600 DPI', 'USB Dongle', '12mo Battery'], stock: 150, rating: 4.1, reviews: 1200, branchRecommendation: ['ALL'] },
  { name: 'Noise Cancelling Headphones', price: 2499, category: 'Accessories', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', description: 'Affordable ANC headphones.', features: ['ANC', '40h Battery', 'Foldable'], stock: 45, rating: 4.3, reviews: 310, branchRecommendation: ['ALL'] },
  { name: 'USB-C Hub 7-in-1', price: 1999, category: 'Accessories', image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600', description: 'Multi-port hub for laptops.', features: ['HDMI 4K', '3x USB 3.0', 'SD/TF Reader'], stock: 80, rating: 4.4, reviews: 160, branchRecommendation: ['ALL'] },

  { name: 'Samsung 55\" 4K Smart TV', price: 48990, category: 'Smart TV', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600', description: '4K UHD Smart TV with HDR.', features: ['4K UHD', 'HDR 10+', 'Tizen OS'], stock: 7, rating: 4.5, reviews: 150, branchRecommendation: ['ALL'] },
  { name: 'LG 43\" Smart TV', price: 29990, category: 'Smart TV', image: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600', description: 'Full HD smart entertainment.', features: ['Full HD', 'WebOS', 'Magic Remote'], stock: 9, rating: 4.3, reviews: 88, branchRecommendation: ['ALL'] },

  { name: 'Arduino Uno Starter Kit', price: 2299, category: 'Others', image: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?w=600', description: 'Perfect for ECE/EEE students.', features: ['Arduino Uno R3', 'Breadboard', '50+ Components'], stock: 35, rating: 4.7, reviews: 410, branchRecommendation: ['ECE', 'EEE'], featured: true },
];

async function seed() {
  try {
    // Seed admin (idempotent)
    const adminEmail = process.env.ADMIN_EMAIL.toLowerCase();
    const adminPass = process.env.ADMIN_PASSWORD;
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const hashed = await bcrypt.hash(adminPass, 10);
      admin = await User.create({
        name: 'Administrator',
        email: adminEmail,
        password: hashed,
        branch: 'CSE',
        role: 'admin',
      });
      console.log('[seed] Admin created');
    } else {
      const ok = await bcrypt.compare(adminPass, admin.password);
      if (!ok) {
        admin.password = await bcrypt.hash(adminPass, 10);
        admin.role = 'admin';
        await admin.save();
        console.log('[seed] Admin password updated');
      }
    }

    // Seed a default test user (idempotent)
    const testEmail = 'student@edutech.com';
    let student = await User.findOne({ email: testEmail });
    if (!student) {
      const h = await bcrypt.hash('Student@123', 10);
      await User.create({
        name: 'Monashree S',
        email: testEmail,
        password: h,
        branch: 'CSE',
        role: 'user',
        phone: '9876543210',
      });
      console.log('[seed] Test student created');
    }

    // Seed products only if empty
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(sampleProducts);
      console.log(`[seed] Inserted ${sampleProducts.length} products`);
    } else {
      console.log(`[seed] Products already present (${count})`);
    }
  } catch (err) {
    console.error('[seed] Error:', err);
  }
}

module.exports = seed;
