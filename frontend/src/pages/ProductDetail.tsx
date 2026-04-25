import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaHeart, FaRegHeart, FaArrowLeft, FaShieldAlt, FaTruck, FaUndo, FaMinus, FaPlus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { productAPI, wishlistAPI } from '../services/api';
import ImageWithFallback from '../components/ImageWithFallback';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getById(id!);
        const data = response.data.data;
        setProduct(data);
        document.title = `${data.name} — E-Shop`;
        try {
          const wishlistRes = await wishlistAPI.get();
          setIsWishlisted(wishlistRes.data.data.items.some((item: any) => item.product === id));
        } catch { setIsWishlisted(false); }
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setCartLoading(true);
    try {
      await addToCart(product._id, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2500);
    } catch (error: any) {
      alert(error?.message || 'Failed to add item to cart.');
    } finally {
      setCartLoading(false);
    }
  };

  const toggleWishlist = async () => {
    if (!product) return;
    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await wishlistAPI.removeFromWishlist(product._id);
        setIsWishlisted(false);
      } else {
        await wishlistAPI.addToWishlist(product._id);
        setIsWishlisted(true);
      }
    } catch (error: any) {
      alert(error?.message || 'Failed to update wishlist.');
    } finally {
      setWishlistLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return Array.from({ length: 5 }, (_, i) => {
      if (i < full) return <FaStar key={i} className="text-yellow-400" />;
      if (i === full && half) return <FaStarHalfAlt key={i} className="text-yellow-400" />;
      return <FaRegStar key={i} className="text-yellow-300" />;
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-surface-400 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Product</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-surface-900 mb-4">Product not found</h2>
          <button onClick={() => navigate('/products')} className="btn-premium-primary">Back to Products</button>
        </div>
      </div>
    );
  }

  const discountPrice = product.discount > 0 ? (product.price * (1 - product.discount / 100)).toFixed(2) : null;
  const categoryName = typeof product.category === 'object' ? product.category.name : (product.category || 'Category');

  const guarantees = [
    { icon: <FaTruck />, title: 'Free Delivery', sub: 'On orders over $100' },
    { icon: <FaUndo />, title: '30-Day Returns', sub: 'Hassle-free returns' },
    { icon: <FaShieldAlt />, title: 'Secure Payment', sub: '100% protected' },
  ];

  return (
    <div className="min-h-screen bg-surface-50 py-10">
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-surface-400 mb-10">
          <Link to="/products" className="flex items-center gap-1.5 hover:text-primary-600 transition-colors font-medium">
            <FaArrowLeft className="text-xs" /> Products
          </Link>
          <span>/</span>
          <span className="text-surface-500">{categoryName}</span>
          <span>/</span>
          <span className="text-surface-900 font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16"
        >
          {/* ── Image Column ── */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-surface-100 shadow-premium">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <ImageWithFallback
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Badges */}
              {product.discount > 0 && (
                <div className="absolute top-6 left-6 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full uppercase tracking-widest shadow">
                  -{product.discount}%
                </div>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-surface-900/50 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-white font-bold text-2xl uppercase tracking-widest border-2 border-white/30 px-8 py-3 rounded-3xl">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === i
                        ? 'border-primary-500 ring-4 ring-primary-100 scale-105'
                        : 'border-surface-200 hover:border-primary-300'
                    }`}
                  >
                    <ImageWithFallback src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info Column ── */}
          <div className="flex flex-col gap-6">
            {/* Category + Brand */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full uppercase tracking-widest">{categoryName}</span>
              {product.brand && (
                <span className="px-3 py-1 bg-surface-100 text-surface-600 text-xs font-bold rounded-full uppercase tracking-widest">{product.brand}</span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-display font-bold text-surface-900 leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-lg">{renderStars(product.ratings?.average || 0)}</div>
              <span className="text-surface-500 font-medium">{product.ratings?.average?.toFixed(1)} · {product.ratings?.count} reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-4">
              <span className="text-5xl font-extrabold text-primary-600">
                ${discountPrice ?? product.price.toFixed(2)}
              </span>
              {discountPrice && (
                <>
                  <span className="text-2xl font-bold text-surface-300 line-through">${product.price.toFixed(2)}</span>
                  <span className="px-3 py-1 bg-red-50 text-red-600 text-sm font-bold rounded-full">Save {product.discount}%</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-surface-500 text-lg leading-relaxed">{product.description}</p>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Quantity + Actions */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-surface-600 uppercase tracking-widest">Quantity</span>
                <div className="flex items-center gap-3 bg-surface-100 rounded-2xl p-1">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-xl hover:bg-white hover:shadow flex items-center justify-center transition-all"
                  >
                    <FaMinus className="text-xs text-surface-600" />
                  </button>
                  <span className="w-8 text-center font-bold text-surface-900 text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 rounded-xl hover:bg-white hover:shadow flex items-center justify-center transition-all"
                  >
                    <FaPlus className="text-xs text-surface-600" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || cartLoading}
                  className={`btn-premium-primary flex-1 !py-4 text-base transition-all ${addedToCart ? '!bg-green-600' : ''}`}
                >
                  {cartLoading ? (
                    <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Adding…</>
                  ) : addedToCart ? (
                    <>✓ Added to Cart</>
                  ) : (
                    <><FaShoppingCart />{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</>
                  )}
                </button>

                <button
                  onClick={toggleWishlist}
                  disabled={wishlistLoading}
                  className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-xl transition-all duration-300 ${
                    isWishlisted
                      ? 'border-red-300 bg-red-50 text-red-500'
                      : 'border-surface-200 bg-white text-surface-400 hover:border-red-300 hover:text-red-500'
                  }`}
                >
                  {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-surface-100">
              {guarantees.map((g, i) => (
                <div key={i} className="text-center p-3 rounded-2xl bg-surface-50 border border-surface-100">
                  <span className="text-primary-500 text-xl flex justify-center mb-2">{g.icon}</span>
                  <p className="text-surface-900 font-bold text-xs">{g.title}</p>
                  <p className="text-surface-400 text-[10px] mt-0.5">{g.sub}</p>
                </div>
              ))}
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {product.tags.map((tag: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-surface-100 text-surface-500 text-xs font-medium rounded-full capitalize">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;