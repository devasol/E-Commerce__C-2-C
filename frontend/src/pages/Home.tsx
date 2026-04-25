import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaShoppingBag, FaTag, FaTruck, FaHeadset, FaShieldAlt, FaGift, FaStar } from 'react-icons/fa';
import { FiArrowRight, FiPackage, FiShoppingBag, FiTruck, FiShield, FiPhoneCall } from 'react-icons/fi';

const Home: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  useEffect(() => {
    document.title = 'E-Shop - Premium E-Commerce Experience';
  }, []);

  // Mock data for featured products
  const featuredProducts = [
    { id: 1, name: 'Premium Wireless Headphones', price: 129.99, rating: 4.8, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500', category: 'Electronics' },
    { id: 2, name: 'Minimalist Smart Watch', price: 199.99, rating: 4.7, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500', category: 'Electronics' },
    { id: 3, name: 'Compact Bluetooth Speaker', price: 89.99, rating: 4.6, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=500', category: 'Audio' },
    { id: 4, name: 'Pro Gaming Mouse', price: 59.99, rating: 4.9, image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=500', category: 'Gaming' },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-32">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div 
            style={{ y: y1 }}
            className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary-200/30 rounded-full blur-[120px]" 
          />
          <motion.div 
            style={{ y: y2 }}
            className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-200/30 rounded-full blur-[100px]" 
          />
          <div className="absolute top-[10%] left-[2%] w-4 h-4 bg-primary-400 rounded-full animate-float" />
          <div className="absolute bottom-[20%] right-[5%] w-6 h-6 bg-accent-400 rounded-full animate-float animation-delay-2000" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 font-bold text-xs uppercase tracking-widest mb-6 border border-primary-200"
              >
                <FaStar className="mr-2" /> Summer Collection 2024
              </motion.div>
              <h1 className="text-6xl lg:text-8xl font-display font-extrabold mb-8 leading-[1.1] text-surface-900">
                Elevate Your <span className="text-gradient">Lifestyle</span>
              </h1>
              <p className="text-xl text-surface-600 mb-10 max-w-lg leading-relaxed">
                Experience the intersection of luxury and technology. Discover our curated collection of premium products designed for the modern individual.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <Link to="/products" className="btn-premium-primary text-lg !px-10">
                  Shop the Collection <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/products" className="btn-premium-outline text-lg !px-10 bg-white/50 backdrop-blur-sm">
                  Explore Now
                </Link>
              </div>

              <div className="mt-16 flex items-center gap-8">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-surface-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-4 border-white bg-primary-600 text-white flex items-center justify-center font-bold text-xs">
                    10k+
                  </div>
                </div>
                <div>
                  <div className="flex text-yellow-400 mb-1">
                    {[1, 2, 3, 4, 5].map(i => <FaStar key={i} />)}
                  </div>
                  <p className="text-sm font-bold text-surface-900">4.9/5 Average Rating</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white/50 animate-subtle-zoom">
                <img 
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80" 
                  alt="Feature Product" 
                  className="w-full h-auto"
                />
              </div>
              
              {/* Floating Cards */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 right-0 md:-right-4 glass-card p-6 rounded-3xl z-20 shadow-2xl border border-white/30"
              >
                <div className="bg-green-500 text-white p-2 rounded-xl mb-3 w-fit">
                  <FiArrowRight className="-rotate-45" />
                </div>
                <p className="text-sm font-bold text-surface-900">+25% Off</p>
                <p className="text-[10px] text-surface-500 uppercase tracking-tighter">Limited Time Offer</p>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 left-4 md:-left-8 glass-card p-6 rounded-3xl z-20 shadow-2xl border border-white/30 backdrop-blur-xl bg-white/70"
              >
                <div className="flex gap-3 mb-4">
                  <img src={featuredProducts[0].image} className="w-12 h-12 rounded-xl object-cover shadow-sm bg-white" alt="Trending 1" />
                  <img src={featuredProducts[1].image} className="w-12 h-12 rounded-xl object-cover shadow-sm bg-white" alt="Trending 2" />
                  <img src={featuredProducts[2].image} className="w-12 h-12 rounded-xl object-cover shadow-sm bg-white" alt="Trending 3" />
                </div>
                <p className="text-base font-display font-bold text-surface-900">Trending Items</p>
                <p className="text-xs text-primary-600 font-bold uppercase tracking-wider cursor-pointer mt-1 hover:text-primary-700">Explore Collection &rarr;</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="pb-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <FiTruck className="text-2xl" />, title: 'Premium Shipping', desc: 'Secure & worldwide tracking' },
              { icon: <FiShield className="text-2xl" />, title: 'Buyer Protection', desc: 'Money back guarantee' },
              { icon: <FiPhoneCall className="text-2xl" />, title: 'Expert Support', desc: 'Dedicated 24/7 assistance' },
              { icon: <FiShoppingBag className="text-2xl" />, title: 'Curated Deals', desc: 'Exclusive member benefits' }
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="bg-white p-8 rounded-[2rem] flex flex-col items-center text-center group border border-surface-100 shadow-sm hover:shadow-premium transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-surface-50 border border-surface-100 flex items-center justify-center text-surface-900 mb-6 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-500 transition-all duration-500 shadow-sm">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-surface-900 mb-3 font-display">{f.title}</h3>
                <p className="text-surface-500 leading-relaxed font-medium">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-surface-100/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
          >
            <div className="max-w-xl">
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-surface-900 mb-6">
                Curated <span className="text-gradient">Excellence</span>
              </h2>
              <p className="text-surface-500 text-lg font-medium leading-relaxed">
                Handpicked selections that define modern trends. Quality craftsmanship meets contemporary design.
              </p>
            </div>
            <Link to="/products" className="btn-premium-outline bg-white hover:bg-primary-600 hover:text-white group transition-all duration-500">
              Explore All <FiArrowRight className="ml-2 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
          >
            {featuredProducts.map((p) => (
              <motion.div
                key={p.id}
                variants={itemVariants}
                className="group h-full flex flex-col"
              >
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-surface-200 shadow-lg group-hover:shadow-2xl group-hover:shadow-primary-500/10 transition-all duration-500">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-900/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 px-6">
                     <button className="w-full py-4 bg-white text-surface-900 rounded-2xl font-bold hover:bg-primary-600 hover:text-white transition-all shadow-xl">
                      Quick Add to Cart
                    </button>
                    <Link to={`/product/${p.id}`} className="w-full py-4 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-2xl font-bold hover:bg-white/30 transition-all text-center">
                      View Details
                    </Link>
                  </div>

                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-surface-900 shadow-sm border border-white/20 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-500 uppercase tracking-widest">
                       {p.category}
                    </span>
                  </div>
                </div>
                
                <div className="pt-6 px-2 flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-surface-900 group-hover:text-primary-600 transition-colors line-clamp-1">{p.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex text-yellow-500 text-sm">
                      {[1, 2, 3, 4, 5].map(i => <FaStar key={i} className={i <= Math.floor(p.rating) ? 'fill-current' : 'opacity-30'} />)}
                    </div>
                    <span className="text-xs font-bold text-surface-400">({p.rating})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-primary-600">${p.price}</span>
                    <button className="w-12 h-12 rounded-2xl bg-surface-100 hover:bg-primary-600 hover:text-white transition-all duration-300 flex items-center justify-center text-surface-400 hover:shadow-lg group-hover:shadow-primary-500/20">
                      <FiPackage className="text-xl" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modern Newsletter / Join Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="relative rounded-[3rem] bg-surface-900 p-12 lg:p-20 overflow-hidden shadow-2xl border border-white/5">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-600/20 rounded-full blur-[100px] -mr-40 -mt-40" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-600/20 rounded-full blur-[100px] -ml-40 -mb-40" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
              <div>
                <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-8">
                  Join the <span className="text-primary-400">Future</span> of Shopping
                </h2>
                <p className="text-white/60 text-lg mb-10 max-w-lg leading-relaxed">
                  Sign up for exclusive early access to the Summer '24 collection and receive a 15% discount on your first order.
                </p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-md">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-grow px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                  />
                  <button className="btn-premium-primary whitespace-nowrap !py-5">
                    Sign Up Now
                  </button>
                </form>
                <p className="text-white/40 text-[10px] mt-6 flex items-center gap-2">
                  <FiShield /> We respect your privacy. No spam, ever.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Users', val: '500K+' },
                  { label: 'Orders', val: '2M+' },
                  { label: 'Rating', val: '4.9/5' },
                  { label: 'Support', val: '24/7' }
                ].map((s, i) => (
                  <div key={i} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 text-center">
                    <p className="text-3xl font-bold text-white mb-2">{s.val}</p>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;