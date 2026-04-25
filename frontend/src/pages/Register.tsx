import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaStore, FaArrowRight, FaCheck } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'seller'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
    setError('');
    try {
      await register(name, email, password, role);
      navigate('/login');
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    'Access to premium products',
    'Exclusive member discounts',
    'Fast, free delivery status',
    'Dedicated 24/7 support',
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Decorative background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary-200/40 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent-200/30 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-5xl w-full mx-auto bg-white/60 backdrop-blur-3xl rounded-[2.5rem] shadow-premium border border-white/50 overflow-hidden flex relative z-10">
        
        {/* Left Panel — Rich Branding */}
        <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-10 lg:p-12 text-white shrink-0">
          <div className="absolute inset-0 bg-primary-900 pointer-events-none z-0">
            <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80" alt="Premium clothing store" className="w-full h-full object-cover mix-blend-overlay opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/40 to-transparent" />
          </div>

          <Link to="/" className="flex items-center gap-3 relative z-10 w-fit group">
            <motion.div whileHover={{ rotate: 10 }} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-bold text-primary-600 text-2xl shadow-xl">E</motion.div>
            <span className="text-3xl font-display font-bold tracking-tight group-hover:text-primary-100 transition-colors">E-Shop</span>
          </Link>

          <div className="relative z-10 mt-auto mb-16">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold tracking-wide mb-8 shadow-lg">
              <HiSparkles className="text-yellow-300 text-lg" />
              Join 50,000+ happy shoppers
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-5xl font-display font-bold leading-[1.1] mb-6 text-white drop-shadow-sm">
              Start your<br /><span className="text-primary-300">premium journey.</span>
            </motion.h2>
            
            <motion.ul initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-4">
              {perks.map((p, i) => (
                <li key={i} className="flex items-center gap-3 text-white/90 font-medium">
                  <div className="w-6 h-6 rounded-full bg-primary-500/30 border border-primary-400/50 flex items-center justify-center shrink-0 shadow-inner">
                    <FaCheck className="text-primary-300 text-[10px]" />
                  </div>
                  {p}
                </li>
              ))}
            </motion.ul>
          </div>
        </div>

        {/* Right Panel — Form Area */}
        <div className="w-full lg:w-[55%] flex items-center justify-center p-8 sm:p-10 lg:p-14 bg-white/40">
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="w-full max-w-md">
            
            {/* Mobile Header elements */}
            <motion.div variants={itemVariants} className="lg:hidden flex justify-between items-center mb-8">
              <Link to="/" className="flex items-center gap-3 w-fit group">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg">E</div>
                <span className="text-2xl font-display font-bold text-surface-900 group-hover:text-primary-600 transition-colors">E-Shop</span>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8 text-center lg:text-left">
              <h1 className="text-4xl font-display font-black text-surface-900 mb-3 tracking-tight">Create Account</h1>
              <p className="text-surface-500 font-medium font-sans">
                Already have one?{' '}
                <Link to="/login" className="text-primary-600 font-bold hover:text-primary-700 underline decoration-primary-200 underline-offset-4">Sign in securely</Link>
              </p>
            </motion.div>

            {error && (
              <motion.div variants={itemVariants} className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-red-200 text-red-500 flex items-center justify-center shrink-0 shadow-sm">!</div>
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 p-1 bg-white/70 rounded-2xl border border-surface-200/50 shadow-inner">
                {(['customer', 'seller'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold capitalize transition-all duration-300 ${
                      role === r
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'text-surface-500 hover:bg-surface-50 hover:text-surface-700'
                    }`}
                  >
                    {r === 'customer' ? <FaUser className="text-sm" /> : <FaStore className="text-sm" />}
                    {r}
                  </button>
                ))}
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-1.5">
                <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <input
                    id="name" type="text" autoComplete="name" required
                    value={name} onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                    className="input-premium pl-12 h-12 bg-white/70 focus:bg-white"
                  />
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300 group-focus-within:text-primary-500 transition-colors" />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-1.5">
                <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Email</label>
                <div className="relative group">
                  <input
                    id="email" type="email" autoComplete="email" required
                    value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-premium pl-12 h-12 bg-white/70 focus:bg-white"
                  />
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300 group-focus-within:text-primary-500 transition-colors" />
                </div>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div variants={itemVariants} className="space-y-1.5">
                  <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative group">
                    <input
                      id="password" type={showPassword ? 'text' : 'password'} required
                      value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-premium pl-12 pr-10 h-12 bg-white/70 focus:bg-white font-mono tracking-wider placeholder:tracking-normal text-sm"
                    />
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300 group-focus-within:text-primary-500 transition-colors" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-md text-surface-400 hover:bg-surface-100 hover:text-surface-700 transition-colors">
                      {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  </div>
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-1.5">
                  <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Confirm</label>
                  <div className="relative group">
                    <input
                      id="confirm-password" type={showConfirmPassword ? 'text' : 'password'} required
                      value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-premium pl-12 pr-10 h-12 bg-white/70 focus:bg-white font-mono tracking-wider placeholder:tracking-normal text-sm"
                    />
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300 group-focus-within:text-primary-500 transition-colors" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-md text-surface-400 hover:bg-surface-100 hover:text-surface-700 transition-colors">
                      {showConfirmPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  </div>
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" required className="peer w-5 h-5 appearance-none rounded-md border-2 border-surface-300 checked:bg-primary-600 checked:border-primary-600 focus:ring-4 focus:ring-primary-500/20 transition-all cursor-pointer" />
                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-surface-600 group-hover:text-surface-900 transition-colors line-clamp-2">
                    I agree to the {' '}
                    <Link to="/terms" className="text-primary-600 font-bold hover:underline">Terms</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-primary-600 font-bold hover:underline">Privacy Policy</Link>
                  </span>
                </label>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-3">
                <button type="submit" disabled={loading} className="btn-premium-primary w-full h-14 text-base shadow-xl shadow-primary-600/20">
                  {loading ? (
                    <div className="flex items-center gap-3 justify-center w-full">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Profile...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 justify-center w-full">
                      <span>Create Account</span>
                      <FaArrowRight className="text-sm" />
                    </div>
                  )}
                </button>
              </motion.div>
            </form>

          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;