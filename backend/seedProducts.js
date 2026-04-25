const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/database');
const Product = require('./models/Product');
const Category = require('./models/Category');
const User = require('./models/User');

const seedProducts = async () => {
  try {
    await connectDB();
    console.log('Connected to DB...');

    // 1. Get Categories
    const categories = await Category.find();
    if (categories.length === 0) {
      console.log('No categories found. Run seedCategories.js first!');
      process.exit(1);
    }
    
    // Map category id by name for easy assignment
    const categoryMap = {};
    categories.forEach(c => { categoryMap[c.name.toLowerCase()] = c._id; });

    // 2. Get or Create a Seller
    let seller = await User.findOne({ role: 'seller' });
    if (!seller) {
      console.log('No seller found. Creating a default seller...');
      seller = await User.create({
        name: 'Premium Store',
        email: 'store@example.com',
        password: 'password123',
        role: 'seller'
      });
    }

    // fallback category if one isn't matched
    const electronicsId = categoryMap['electronics'] || categories[0]._id;
    const clothingId = categoryMap['clothing'] || categories[0]._id;
    const homeId = categoryMap['home & garden'] || categories[0]._id;
    const sportsId = categoryMap['sports & outdoors'] || categories[0]._id;
    const beautyId = categoryMap['beauty & personal care'] || categories[0]._id;

    const dummyProducts = [
      // Electronics
      {
        name: "Premium Wireless Noise-Cancelling Headphones",
        description: "Experience industry-leading noise cancellation. Features up to 30 hours of battery life and crystal clear hands-free calling.",
        price: 299.99,
        category: electronicsId,
        subcategory: "Audio",
        brand: "SoundMakers",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"],
        stock: 50,
        seller: seller._id,
        ratings: { average: 4.8, count: 124 },
        tags: ["wireless", "audio", "headphones", "bluetooth"]
      },
      {
        name: "Minimalist Smart Watch Series 5",
        description: "Track your fitness, heart rate, and notifications seamlessly. Features an always-on retina display and swim-proof design.",
        price: 399.00,
        category: electronicsId,
        subcategory: "Wearables",
        brand: "TechNova",
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"],
        stock: 120,
        seller: seller._id,
        ratings: { average: 4.7, count: 342 },
        tags: ["wearable", "smartwatch", "fitness"]
      },
      {
        name: "Pro Gaming Mouse RGB",
        description: "High-precision 16,000 DPI optical sensor. Customizable RGB lighting with 11 programmable buttons.",
        price: 79.99,
        category: electronicsId,
        subcategory: "Gaming Accessories",
        brand: "GamerGear",
        images: ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80"],
        stock: 85,
        seller: seller._id,
        ratings: { average: 4.9, count: 87 },
        tags: ["gaming", "mouse", "rgb"]
      },
      {
        name: "Ultra-Thin 15-inch Laptop",
        description: "Powerful performance packed in a sleek aluminum unibody. 16GB RAM, 512GB SSD, and dedicated graphics.",
        price: 1299.99,
        category: electronicsId,
        subcategory: "Laptops",
        brand: "ZenTech",
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80"],
        stock: 30,
        seller: seller._id,
        ratings: { average: 4.6, count: 54 },
        tags: ["laptop", "computer", "tech"]
      },
      
      // Clothing
      {
        name: "Classic Denim Jacket",
        description: "A versatile wardrobe staple. Made from 100% premium cotton denim with a vintage wash.",
        price: 59.99,
        category: clothingId,
        subcategory: "Outerwear",
        brand: "UrbanWear",
        images: ["https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80"],
        stock: 45,
        seller: seller._id,
        ratings: { average: 4.5, count: 112 },
        tags: ["denim", "jacket", "fashion"]
      },
      {
        name: "Breathable Running Sneakers",
        description: "Ultra-lightweight mesh upper for maximum airflow. Responsive cushioning for high-impact workouts.",
        price: 110.00,
        category: clothingId,
        subcategory: "Shoes",
        brand: "AeroStep",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"],
        stock: 200,
        seller: seller._id,
        ratings: { average: 4.8, count: 423 },
        tags: ["shoes", "running", "sneakers"]
      },

      // Home & Garden
      {
        name: "Ceramic Minimalist Vase",
        description: "Handcrafted matte ceramic vase perfect for dried florals or as a standalone architectural piece.",
        price: 34.50,
        category: homeId,
        subcategory: "Decor",
        brand: "HomeAesthetics",
        images: ["https://images.unsplash.com/photo-1581783342308-f7d9b990dddf?auto=format&fit=crop&w=800&q=80"],
        stock: 60,
        seller: seller._id,
        ratings: { average: 4.4, count: 56 },
        tags: ["home", "decor", "ceramic"]
      },
      {
        name: "Ergonomic Office Chair",
        description: "Fully adjustable lumbar support and breathable mesh back. Designed for 8+ hours of comfortable sitting.",
        price: 249.99,
        category: homeId,
        subcategory: "Furniture",
        brand: "ErgoComfort",
        images: ["https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=800&q=80"],
        stock: 15,
        seller: seller._id,
        ratings: { average: 4.6, count: 213 },
        tags: ["furniture", "office", "chair"]
      },

      // Sports
      {
        name: "Eco-Friendly Yoga Mat",
        description: "Non-slip texture, extra thick cushioning, made from biodegradable cork and natural rubber.",
        price: 45.00,
        category: sportsId,
        subcategory: "Fitness Equipment",
        brand: "ZenYoga",
        images: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80"],
        stock: 140,
        seller: seller._id,
        ratings: { average: 4.9, count: 400 },
        tags: ["yoga", "fitness", "eco"]
      },
      
      // Beauty
      {
        name: "Hydrating Facial Serum",
        description: "Packed with Hyaluronic Acid and Vitamin C for a radiant, youthful glow. Cruelty-free.",
        price: 38.00,
        category: beautyId,
        subcategory: "Skincare",
        brand: "GlowAura",
        images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"],
        stock: 300,
        seller: seller._id,
        ratings: { average: 4.7, count: 1022 },
        tags: ["skincare", "beauty", "serum"]
      }
    ];

    console.log('Clearing old products...');
    await Product.deleteMany({});
    
    console.log('Inserting mock products...');
    await Product.insertMany(dummyProducts);
    
    console.log(`Successfully seeded ${dummyProducts.length} mock products!`);
    process.exit(0);

  } catch (err) {
    console.error('Error seeding products:', err);
    process.exit(1);
  }
};

seedProducts();
