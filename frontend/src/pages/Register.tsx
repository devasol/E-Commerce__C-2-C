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
    'Access to 10,000+ premium products',
    'Exclusive member discounts & early sales',
    'Fast, free delivery on orders over $100',
    'Dedicated 24/7 customer support',
  ];

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 mesh-gradient relative overflow-hidden flex-col justify-between p-16">
        <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-primary-600/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-[10%] right-[-10%] w-72 h-72 bg-accent-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '3s' }} />

        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg">E</div>
          <span className="text-2xl font-display font-bold text-white">E-Shop</span>
        </Link>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-8">
            <HiSparkles className="text-yellow-300" />
            Join 50,000+ happy shoppers
          </div>
          <h2 className="text-5xl font-display font-bold text-white leading-tight mb-8">
            Start your<br /><span className="text-primary-300">premium journey</span>
          </h2>
          <ul className="space-y-4">
            {perks.map((p, i) => (
              <li key={i} className="flex items-center gap-3 text-white/80">
                <div className="w-6 h-6 rounded-full bg-primary-500/30 border border-primary-400/50 flex items-center justify-center shrink-0">
                  <FaCheck className="text-primary-300 text-[10px]" />
                </div>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card-dark rounded-2xl p-6 relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">S</div>
            <div>
              <p className="text-white font-semibold text-sm">Sarah K.</p>
              <p className="text-white/50 text-xs">Verified Buyer</p>
            </div>
          </div>
          <p className="text-white/70 text-sm italic">"The best online shopping experience I've had. The UI is stunning and delivery is always on time!"</p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center font-bold text-white text-xl">E</div>
            <span className="text-2xl font-display font-bold text-surface-900">E-Shop</span>
          </Link>

          <div className="mb-10">
            <h1 className="text-4xl font-display font-bold text-surface-900 mb-2">Create account</h1>
            <p className="text-surface-500">Already have one?{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign in</Link>
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium mb-6 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center shrink-0 font-bold">!</div>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Account Type Toggle */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-surface-600 uppercase tracking-widest">Account Type</label>
              <div className="grid grid-cols-2 gap-3 p-1 bg-surface-100 rounded-2xl">
                {(['customer', 'seller'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold capitalize transition-all duration-300 ${
                      role === r
                        ? 'bg-white shadow-md text-primary-600 ring-2 ring-primary-100'
                        : 'text-surface-500 hover:text-surface-700'
                    }`}
                  >
                    {r === 'customer' ? <FaUser className="text-sm" /> : <FaStore className="text-sm" />}
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-surface-600 uppercase tracking-widest">Full Name</label>
              <div className="relative">
                <input
                  id="name" type="text" autoComplete="name" required
                  value={name} onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  className="input-premium pl-12"
                />
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-surface-600 uppercase tracking-widest">Email</label>
              <div className="relative">
                <input
                  id="email" type="email" autoComplete="email" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-premium pl-12"
                />
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300" />
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-surface-600 uppercase tracking-widest">Password</label>
                <div className="relative">
                  <input
                    id="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-premium pl-12 pr-12"
                  />
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-300 hover:text-surface-600 transition-colors">
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-surface-600 uppercase tracking-widest">Confirm</label>
                <div className="relative">
                  <input
                    id="confirm-password" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" required
                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-premium pl-12 pr-12"
                  />
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300" />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-300 hover:text-surface-600 transition-colors">
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer group pt-1">
              <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500" />
              <span className="text-sm text-surface-600">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 font-semibold hover:underline">Terms</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary-600 font-semibold hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <button type="submit" disabled={loading} className="btn-premium-primary w-full !py-4 text-base mt-2">
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating account…</>
              ) : (
                <>Create account <FaArrowRight className="ml-1" /></>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;