import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaUserShield, FaSave, FaKey, FaBoxOpen, FaHeart, FaWallet, FaCamera } from 'react-icons/fa';
import { orderAPI, wishlistAPI } from '../services/api';
import { useNotification } from '../context/NotificationContext';

const Profile: React.FC = () => {
  const { state: authState, updateProfile, changePassword } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [roleData, setRoleData] = useState<'customer' | 'seller'>('customer');
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [activeTab, setActiveTab] = useState<'general' | 'security'>('general');
  const [stats, setStats] = useState({ ordersCount: 0, totalSpent: 0, wishlistCount: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (authState.user) {
      setUserData({ name: authState.user.name || '', email: authState.user.email || '' });
      setRoleData((authState.user.role === 'customer' || authState.user.role === 'seller') ? authState.user.role : 'customer');
    }
    document.title = 'My Profile — E-Shop';
  }, [authState.user]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const [ordersRes, wishlistRes] = await Promise.all([
          orderAPI.getMyOrders().catch(() => ({ data: [] })),
          wishlistAPI.get().catch(() => ({ data: [] }))
        ]);
        
        const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
        const totalSpent = orders.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0);
        
        let wishlistCount = 0;
        if (Array.isArray(wishlistRes.data)) {
          wishlistCount = wishlistRes.data.length;
        } else if (wishlistRes.data?.products) {
          wishlistCount = wishlistRes.data.products.length;
        } else if (wishlistRes.data?.items) {
          wishlistCount = wishlistRes.data.items.length;
        }

        setStats({
          ordersCount: orders.length,
          totalSpent,
          wishlistCount
        });
      } catch (err) {
        console.error('Failed to fetch user stats', err);
      } finally {
        setLoadingStats(false);
      }
    };
    
    if (authState.user) {
      fetchStats();
    }
  }, [authState.user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ ...userData, role: roleData });
      showSuccess('Your profile has been updated successfully.');
    } catch (err: any) {
      showError(err.response?.data?.message || err.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      showError('New passwords do not match');
      return;
    }
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      showSuccess('Your password has been changed successfully.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err: any) {
      showError(err.message || 'Failed to change password');
    }
  };

  const stagger = { animate: { transition: { staggerChildren: 0.1 } } };
  const floatUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } };

  return (
    <div className="min-h-screen bg-surface-50 pt-24 pb-20 relative overflow-hidden">
      
      {/* Immersive Floating Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-primary-200/40 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent-200/30 rounded-full blur-[100px] pointer-events-none -z-10" />
      
      {/* Geometric Accents */}
      <div className="absolute top-[20%] right-[10%] w-32 h-32 border-[20px] border-primary-500/10 rounded-full blur-[2px] pointer-events-none -z-10" />

      <motion.div initial="initial" animate="animate" variants={stagger} className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Banner Card - ID Profile */}
        <motion.div variants={floatUp} className="bg-white/60 backdrop-blur-3xl rounded-[3rem] p-8 md:p-12 mb-10 shadow-premium border border-white/50 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900 pointer-events-none -z-10 opacity-5 group-hover:opacity-10 transition-opacity duration-1000" />
          
          <div className="relative">
            <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-primary-500 to-accent-400 p-1 shadow-2xl">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center border-4 border-white overflow-hidden relative">
                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-primary-600 to-accent-500">
                  {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                </span>
                <div className="absolute inset-0 bg-primary-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
            <button className="absolute bottom-1 right-1 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-xl border-4 border-white hover:bg-primary-500 hover:scale-110 transition-all duration-300">
              <FaCamera className="text-lg" />
            </button>
          </div>
          
          <div className="text-center md:text-left flex-grow">
            <motion.h1 className="text-4xl md:text-5xl font-display font-black text-surface-900 mb-3 tracking-tight">
              {userData.name || 'User Profile'}
            </motion.h1>
            <div className="flex flex-col md:flex-row items-center gap-4 text-surface-600 font-medium font-sans">
              <span className="flex items-center gap-2 bg-surface-100/50 px-4 py-2 rounded-xl backdrop-blur-md">
                <FaEnvelope className="text-primary-500" /> {userData.email || 'Initializing...'}
              </span>
              <span className="flex items-center gap-2 capitalize px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 text-primary-700 font-bold">
                <FaUserShield className="text-primary-600" /> {roleData} Account
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: FaBoxOpen, color: 'blue', value: loadingStats ? '...' : stats.ordersCount.toString(), label: 'Total Orders', gradient: 'from-blue-500 to-cyan-400' },
            { icon: FaWallet, color: 'emerald', value: loadingStats ? '...' : `$${stats.totalSpent.toFixed(2)}`, label: 'Total Spent', gradient: 'from-emerald-500 to-green-400' },
            { icon: FaHeart, color: 'rose', value: loadingStats ? '...' : stats.wishlistCount.toString(), label: 'Wishlist Items', gradient: 'from-rose-500 to-pink-400' }
          ].map((stat, i) => (
            <motion.div key={i} variants={floatUp} whileHover={{ y: -5 }} className="bg-white/60 backdrop-blur-3xl rounded-[2.5rem] p-6 lg:p-8 flex items-center gap-6 shadow-premium border border-white/50 group">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${stat.gradient} flex items-center justify-center text-white text-2xl shadow-lg shadow-${stat.color}-500/30 group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon />
              </div>
              <div>
                <p className="text-3xl font-black text-surface-900 tracking-tight">{stat.value}</p>
                <p className="text-surface-500 font-bold text-xs uppercase tracking-widest">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Core Settings Form Card */}
        <motion.div variants={floatUp} className="bg-white/60 backdrop-blur-3xl rounded-[3rem] shadow-premium border border-white/50 overflow-hidden relative">
          
          <div className="p-8 md:p-12">
            
            {/* Interactive Tab Switcher */}
            <div className="flex bg-surface-100/50 p-2 rounded-2xl w-fit mb-10 relative shadow-inner">
              {['general', 'security'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`relative px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide capitalize z-10 transition-colors ${activeTab === tab ? 'text-primary-700' : 'text-surface-500 hover:text-surface-700'}`}
                >
                  {activeTab === tab && (
                    <motion.div layoutId="activeProfileTab" className="absolute inset-0 bg-white shadow-sm rounded-xl -z-10 border border-white/60" />
                  )}
                  {tab === 'general' ? 'General Info' : 'Security Settings'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">

              {activeTab === 'general' ? (
                <motion.form key="general" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleUpdateProfile} className="space-y-6 max-w-2xl">
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <input type="text" value={userData.name} onChange={e => setUserData({...userData, name: e.target.value})} className="input-premium pl-14 h-14 bg-white/70 focus:bg-white text-lg font-medium" required />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-surface-100 rounded-lg group-focus-within:bg-primary-100 group-focus-within:text-primary-600 transition-colors text-surface-400">
                        <FaUser size={14} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative group">
                      <input type="email" value={userData.email} onChange={e => setUserData({...userData, email: e.target.value})} className="input-premium pl-14 h-14 bg-white/70 focus:bg-white text-lg font-medium" required />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-surface-100 rounded-lg group-focus-within:bg-primary-100 group-focus-within:text-primary-600 transition-colors text-surface-400">
                        <FaEnvelope size={14} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Account Type</label>
                    <div className="grid grid-cols-2 gap-4 h-16 p-1.5 bg-surface-100/50 rounded-2xl border border-surface-200/50">
                      {(['customer', 'seller'] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRoleData(r)}
                          className={`flex items-center justify-center gap-2 rounded-xl font-bold capitalize transition-all duration-300 ${
                            roleData === r
                              ? 'bg-white shadow-md text-primary-600 border border-white'
                              : 'text-surface-500 hover:text-surface-700'
                          }`}
                        >
                          {r === 'customer' ? <FaUser className="text-sm" /> : <FaBoxOpen className="text-sm" />}
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <button type="submit" className="btn-premium-primary w-fit px-10 h-14 text-base shadow-xl shadow-primary-600/20 group">
                      <FaSave className="mr-2 group-hover:scale-110 transition-transform" /> Save Changes
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.form key="security" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleChangePassword} className="space-y-6 max-w-2xl">
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Current Password</label>
                    <div className="relative group">
                      <input type="password" value={passwordData.currentPassword} onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} className="input-premium pl-14 h-14 bg-white/70 focus:bg-white font-mono tracking-widest" required />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-surface-100 rounded-lg group-focus-within:bg-primary-100 group-focus-within:text-primary-600 transition-colors text-surface-400">
                        <FaLock size={14} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">New Password</label>
                      <div className="relative group">
                        <input type="password" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} className="input-premium pl-14 h-14 bg-red-50/50 focus:bg-red-50 border-red-200 focus:ring-red-400 font-mono tracking-widest text-red-900" required />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-red-100 rounded-lg group-focus-within:bg-red-200 group-focus-within:text-red-700 transition-colors text-red-400">
                          <FaKey size={14} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                      <div className="relative group">
                        <input type="password" value={passwordData.confirmNewPassword} onChange={e => setPasswordData({...passwordData, confirmNewPassword: e.target.value})} className="input-premium pl-14 h-14 bg-red-50/50 focus:bg-red-50 border-red-200 focus:ring-red-400 font-mono tracking-widest text-red-900" required />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-red-100 rounded-lg group-focus-within:bg-red-200 group-focus-within:text-red-700 transition-colors text-red-400">
                          <FaKey size={14} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button type="submit" className="btn-premium bg-red-600 text-white hover:bg-red-700 w-fit px-10 h-14 text-base shadow-xl shadow-red-600/30 group">
                      <FaKey className="mr-2 group-hover:rotate-12 transition-transform" /> Update Password
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;