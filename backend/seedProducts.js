const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');

// Sample products with working images
const products = [
  {
    name: 'Smartphone X Pro',
    description: 'Latest smartphone with triple camera system, 128GB storage, and 48-hour battery life.',
    price: 899.99,
    category: null, // Will be set after category is created/found
    subcategory: 'Smartphones',
    brand: 'TechCorp',
    images: ['https://images.unsplash.com/photo-1594030540479-578d39b7b2ba?auto=format&fit=crop&w=500'],
    stock: 50,
    ratings: { average: 4.7, count: 245 },
    discount: 10,
    tags: ['smartphone', 'mobile', 'tech', 'latest']
  },
  {
    name: 'Gaming Laptop Ultra',
    description: 'High-performance gaming laptop with RTX graphics, 16GB RAM, and 1TB SSD storage.',
    price: 1499.99,
    category: null,
    subcategory: 'Laptops',
    brand: 'GameTech',
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500'],
    stock: 25,
    ratings: { average: 4.8, count: 120 },
    discount: 5,
    tags: ['gaming', 'laptop', 'performance', 'graphics']
  },
  {
    name: 'Wireless Earbuds Pro',
    description: 'True wireless earbuds with active noise cancellation and 24-hour battery life.',
    price: 199.99,
    category: null,
    subcategory: 'Audio',
    brand: 'AudioMax',
    images: ['https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=500'],
    stock: 100,
    ratings: { average: 4.5, count: 320 },
    discount: 15,
    tags: ['earbuds', 'wireless', 'audio', 'noise-cancelling']
  },
  {
    name: 'Digital SLR Camera',
    description: 'Professional DSLR camera with 24MP sensor, 4K video, and interchangeable lenses.',
    price: 799.99,
    category: null,
    subcategory: 'Cameras',
    brand: 'PhotoPro',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500'],
    stock: 30,
    ratings: { average: 4.9, count: 85 },
    discount: 0,
    tags: ['camera', 'dslr', 'photography', 'professional']
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracker with heart rate monitor, GPS, and water resistance.',
    price: 249.99,
    category: null,
    subcategory: 'Wearables',
    brand: 'FitTech',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500'],
    stock: 75,
    ratings: { average: 4.4, count: 180 },
    discount: 20,
    tags: ['smartwatch', 'fitness', 'tracker', 'health']
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB mechanical keyboard with programmable keys and ergonomic design.',
    price: 129.99,
    category: null,
    subcategory: 'Accessories',
    brand: 'KeyPro',
    images: ['https://images.unsplash.com/photo-1546813788-4a1a2f7c9f87?auto=format&fit=crop&w=500'],
    stock: 60,
    ratings: { average: 4.6, count: 150 },
    discount: 0,
    tags: ['keyboard', 'gaming', 'mechanical', 'rgb']
  },
  {
    name: '4K Ultra HD TV 55"',
    description: '55-inch 4K Smart TV with HDR, voice control, and streaming apps.',
    price: 699.99,
    category: null,
    subcategory: 'TVs',
    brand: 'VisionMax',
    images: ['https://images.unsplash.com/photo-1593305841991-0173b693e8d4?auto=format&fit=crop&w=500'],
    stock: 20,
    ratings: { average: 4.7, count: 95 },
    discount: 12,
    tags: ['tv', '4k', 'smart', 'ultra-hd']
  },
  {
    name: 'Bluetooth Speaker Portable',
    description: 'Waterproof portable speaker with 360-degree sound and 20-hour battery.',
    price: 89.99,
    category: null,
    subcategory: 'Audio',
    brand: 'SoundMax',
    images: ['https://images.unsplash.com/photo-1613047508032-34a0d5935d9a?auto=format&fit=crop&w=500'],
    stock: 80,
    ratings: { average: 4.3, count: 210 },
    discount: 8,
    tags: ['speaker', 'bluetooth', 'portable', 'waterproof']
  },
  {
    name: 'External SSD 1TB',
    description: 'Ultra-fast external SSD with USB 3.2 interface and compact design.',
    price: 149.99,
    category: null,
    subcategory: 'Storage',
    brand: 'DriveTech',
    images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=500'],
    stock: 40,
    ratings: { average: 4.5, count: 165 },
    discount: 18,
    tags: ['ssd', 'storage', 'external', 'fast']
  },
  {
    name: 'Wireless Gaming Mouse',
    description: 'High-precision wireless gaming mouse with customizable RGB lighting.',
    price: 79.99,
    category: null,
    subcategory: 'Accessories',
    brand: 'GamePro',
    images: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=500'],
    stock: 90,
    ratings: { average: 4.4, count: 140 },
    discount: 0,
    tags: ['mouse', 'gaming', 'wireless', 'precision']
  },
  {
    name: 'Electric Toothbrush',
    description: 'Sonic electric toothbrush with multiple cleaning modes and smart timer.',
    price: 119.99,
    category: null,
    subcategory: 'Personal Care',
    brand: 'CleanTech',
    images: ['https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=500'],
    stock: 120,
    ratings: { average: 4.6, count: 280 },
    discount: 25,
    tags: ['toothbrush', 'electric', 'sonic', 'oral-care']
  },
  {
    name: 'Robot Vacuum Cleaner',
    description: 'Smart robot vacuum with app control, mapping technology, and auto-empty station.',
    price: 399.99,
    category: null,
    subcategory: 'Home Appliances',
    brand: 'CleanBot',
    images: ['https://images.unsplash.com/photo-1587840171670-8b850147754e?auto=format&fit=crop&w=500'],
    stock: 35,
    ratings: { average: 4.2, count: 175 },
    discount: 15,
    tags: ['vacuum', 'robot', 'smart', 'home']
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Create or find categories
const setupCategories = async () => {
  const categoriesData = [
    { name: 'Electronics', description: 'Electronic devices and gadgets' },
    { name: 'Computers', description: 'Computers, laptops, and accessories' },
    { name: 'Audio', description: 'Audio equipment and accessories' },
    { name: 'Cameras', description: 'Cameras and photography equipment' },
    { name: 'Wearables', description: 'Smart watches and fitness trackers' },
    { name: 'Home', description: 'Home appliances and electronics' },
    { name: 'Personal Care', description: 'Personal care and grooming products' }
  ];

  for (const catData of categoriesData) {
    let category = await Category.findOne({ name: catData.name });
    if (!category) {
      category = await Category.create(catData);
    }
  }
};

// Seed products
const seedProducts = async () => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products...');

    // Create or find categories
    await setupCategories();

    // Get categories
    const electronicsCategory = await Category.findOne({ name: 'Electronics' });
    const computersCategory = await Category.findOne({ name: 'Computers' });
    const audioCategory = await Category.findOne({ name: 'Audio' });
    const camerasCategory = await Category.findOne({ name: 'Cameras' });
    const wearablesCategory = await Category.findOne({ name: 'Wearables' });
    const homeCategory = await Category.findOne({ name: 'Home' });
    const personalCareCategory = await Category.findOne({ name: 'Personal Care' });

    // Map categories to products
    products.forEach(product => {
      switch(product.subcategory) {
        case 'Smartphones':
        case 'Laptops':
          product.category = computersCategory._id;
          break;
        case 'Audio':
          product.category = audioCategory._id;
          break;
        case 'Cameras':
          product.category = camerasCategory._id;
          break;
        case 'Wearables':
          product.category = wearablesCategory._id;
          break;
        case 'TVs':
        case 'Accessories':
        case 'Storage':
          product.category = electronicsCategory._id;
          break;
        case 'Home Appliances':
          product.category = homeCategory._id;
          break;
        case 'Personal Care':
          product.category = personalCareCategory._id;
          break;
        default:
          product.category = electronicsCategory._id;
      }
    });

    // Create a default seller user
    const User = require('./models/User');
    let seller = await User.findOne({ email: 'seller@example.com' });
    if (!seller) {
      try {
        seller = await User.create({
          name: 'Default Seller',
          email: 'seller@example.com',
          password: 'password123', // This will be hashed by the pre-save hook
          role: 'seller'
        });
      } catch (userError) {
        console.log('Seller user already exists or error creating user:', userError.message);
        // If user creation failed, try to find an existing seller
        seller = await User.findOne({ role: 'seller' }) || await User.findOne({ email: 'seller@example.com' });
        if (!seller) {
          // If no seller exists, use the first user as a fallback
          seller = await User.findOne({});
        }
        if (!seller) {
          console.error('No users found in database. Please create at least one user first.');
          process.exit(1);
        }
      }
    }

    // Assign the seller to all products
    products.forEach(product => {
      product.seller = seller._id;
    });

    // Insert products
    await Product.insertMany(products);
    console.log(`${products.length} products inserted successfully!`);
  } catch (error) {
    console.error(`Error seeding products: ${error.message}`);
    process.exit(1);
  }
};

// Run the seed
const runSeed = async () => {
  await connectDB();
  await seedProducts();
  process.exit(0);
};

runSeed();