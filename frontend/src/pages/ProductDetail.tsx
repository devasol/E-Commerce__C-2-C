import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaRegStar, FaStarHalfAlt, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

// Mock data for a product
const mockProduct = {
  _id: '1',
  name: 'Wireless Bluetooth Headphones',
  description: 'Experience premium sound quality with these wireless Bluetooth headphones. Featuring noise cancellation, long battery life, and comfortable over-ear design for extended listening sessions.',
  price: 99.99,
  images: [
    'https://via.placeholder.com/600x600',
    'https://via.placeholder.com/600x600',
    'https://via.placeholder.com/600x600',
    'https://via.placeholder.com/600x600'
  ],
  ratings: { average: 4.5, count: 120 },
  discount: 10,
  stock: 25,
  brand: 'AudioTech',
  category: { name: 'Electronics' },
  subcategory: 'Headphones',
  tags: ['wireless', 'bluetooth', 'noise-cancelling', 'premium']
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get product details
    setTimeout(() => {
      setProduct(mockProduct);
      setLoading(false);
      document.title = `${mockProduct.name} - E-Shop`;
    }, 1000);
  }, [id]);

  const handleAddToCart = async () => {
    try {
      if (product) {
        await addToCart(product._id, quantity);
        navigate('/cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return <div className="flex">{stars}</div>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <button 
          onClick={() => navigate('/products')}
          className="btn-primary mt-4"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="bg-white rounded-lg shadow-md overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Images */}
          <div>
            <div className="mb-4">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name} 
                className="w-full h-96 object-contain rounded-lg"
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border rounded-lg overflow-hidden ${
                    selectedImage === index ? 'border-blue-500 border-2' : 'border-gray-300'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} ${index + 1}`} 
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div>
            <div className="mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                {product.category.name}
              </span>
              {product.subcategory && (
                <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded ml-2">
                  {product.subcategory}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              {renderRating(product.ratings.average)}
              <span className="text-gray-600 ml-2">({product.ratings.count} reviews)</span>
            </div>
            
            <div className="flex items-center mb-6">
              {product.discount > 0 ? (
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-red-600">
                    ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                  <span className="text-gray-500 line-through ml-4 text-xl">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="bg-red-100 text-red-800 text-sm font-semibold ml-4 px-2.5 py-0.5 rounded">
                    {product.discount}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              )}
            </div>
            
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Features:</h3>
              <ul className="list-disc pl-5 text-gray-600">
                <li>Wireless Bluetooth 5.0 connectivity</li>
                <li>Active noise cancellation technology</li>
                <li>Up to 30 hours of battery life</li>
                <li>Comfortable over-ear design</li>
                <li>Built-in microphone for calls</li>
              </ul>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <span className="font-semibold mr-4">Quantity:</span>
                <div className="flex items-center border rounded">
                  <button 
                    className="px-3 py-1 text-xl"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{quantity}</span>
                  <button 
                    className="px-3 py-1 text-xl"
                    onClick={() => setQuantity(q => q + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex items-center px-6 py-3 rounded-lg font-semibold ${
                    product.stock === 0 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <FaShoppingCart className="mr-2" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                
                <button className="flex items-center px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100">
                  <FaHeart className="mr-2" />
                  Wishlist
                </button>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Availability: </span>
                  <span className={product.stock > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Brand: </span>
                  <span className="font-semibold">{product.brand}</span>
                </div>
                <div>
                  <span className="text-gray-600">Category: </span>
                  <span className="font-semibold">{product.category.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">SKU: </span>
                  <span className="font-semibold">WH-{product._id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockProduct.images.slice(0, 4).map((img, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden product-card"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <img src={img} alt={`Related product ${index + 1}`} className="h-full w-full object-contain" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Related Product {index + 1}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">${(Math.random() * 100 + 50).toFixed(2)}</span>
                  <button className="btn-primary text-sm">View</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;