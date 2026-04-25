import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaShoppingCart, FaRegHeart } from 'react-icons/fa';
import { FiArrowRight, FiPackage } from 'react-icons/fi';
import ImageWithFallback from './ImageWithFallback';

interface ProductCardProps {
  product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discountPrice = product.discount > 0 
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group bg-white rounded-[2.5rem] p-4 shadow-premium hover:shadow-premium-hover transition-all duration-500 border border-surface-100 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-surface-50 mb-6">
        <Link to={`/product/${product._id}`}>
          <ImageWithFallback
            src={product.images && product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.discount > 0 && (
            <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg">
              -{product.discount}%
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="px-3 py-1 bg-accent-500 text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg">
              Low Stock
            </span>
          )}
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-surface-900/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-3 backdrop-blur-[2px]">
          <button className="w-12 h-12 rounded-2xl bg-white text-surface-900 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all shadow-xl hover:-translate-y-1">
            <FaRegHeart />
          </button>
          <button className="w-12 h-12 rounded-2xl bg-white text-surface-900 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all shadow-xl hover:-translate-y-1">
            <FaShoppingCart />
          </button>
        </div>

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-surface-900/60 backdrop-blur-sm flex items-center justify-center">
            <span className="text-white font-bold text-lg uppercase tracking-widest border-2 border-white/30 px-6 py-2 rounded-2xl">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-2 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2 gap-4">
          <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">{product.category}</p>
          <div className="flex items-center gap-1 text-yellow-400">
            <FaStar className="text-xs" />
            <span className="text-xs font-bold text-surface-400">{product.ratings?.average || '0.0'}</span>
          </div>
        </div>

        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-bold text-surface-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-tight mb-4">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            {discountPrice ? (
              <>
                <span className="text-2xl font-extrabold text-primary-600">${discountPrice}</span>
                <span className="text-sm font-bold text-surface-300 line-through">${product.price}</span>
              </>
            ) : (
              <span className="text-2xl font-extrabold text-primary-600">${product.price}</span>
            )}
          </div>
          
          <Link 
            to={`/product/${product._id}`}
            className="w-12 h-12 rounded-2xl bg-surface-50 border border-surface-100 flex items-center justify-center text-surface-400 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-500 transition-all shadow-sm group-hover:shadow-lg group-hover:shadow-primary-500/20"
          >
            <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
