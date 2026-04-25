import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaUserShield, FaSave, FaKey, FaBoxOpen, FaHeart, FaWallet, FaCamera } from 'react-icons/fa';

const Profile: React.FC = () => {
  const { state: authState, updateProfile, changePassword } = useAuth();
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [roleData, setRoleData] = useState<'customer' | 'seller'>('customer');
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'security'>('general');

  useEffect(() => {
    if (authState.user) {
      setUserData({ name: authState.user.name || '', email: authState.user.email || '' });
      setRoleData((authState.user.role === 'customer' || authState.user.role === 'seller') ? authState.user.role : 'customer');
    }
    document.title = 'My Profile — E-Shop';
  }, [authState.user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccessMessage('');
    try {
      await updateProfile({ ...userData, role: roleData });
      setSuccessMessage('Profile and role updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccessMessage('');
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setSuccessMessage('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 pb-20">
      {/* Premium Hero Profile Section */}
      <div className="relative pt-32 pb-16 px-6 mesh-gradient overflow-hidden">
        <div className="absolute inset-0 bg-primary-900/10 backdrop-blur-[100px]" />
        
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2rem] bg-white shadow-xl flex items-center justify-center border-4 border-white/50 overflow-hidden">
                <span className="text-5xl font-bold text-primary-600">{userData.name.charAt(0).toUpperCase()}</span>
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:bg-primary-700 transition-colors">
                <FaCamera />
              </button>
            </div>
            
            <div className="mb-2">
              <h1 className="text-4xl font-display font-bold text-surface-900">{userData.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-3 mt-2 text-surface-600 font-medium">
                <span className="flex items-center gap-1.5"><FaEnvelope className="text-primary-500" /> {userData.email}</span>
                <span>•</span>
                <span className="flex items-center gap-1.5 capitalize px-2.5 py-0.5 rounded-md bg-white/50 border border-white/60"><FaUserShield className="text-primary-500" /> {roleData}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Quick Stats Column (Left) */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[2rem] p-6 text-center shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-3 text-xl"><FaBoxOpen /></div>
              <p className="text-3xl font-bold text-surface-900">12</p>
              <p className="text-surface-500 font-medium text-sm">Total Orders</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-[2rem] p-6 text-center shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-3 text-xl"><FaWallet /></div>
              <p className="text-3xl font-bold text-surface-900">$849.50</p>
              <p className="text-surface-500 font-medium text-sm">Total Spent</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-[2rem] p-6 text-center shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-3 text-xl"><FaHeart /></div>
              <p className="text-3xl font-bold text-surface-900">5</p>
              <p className="text-surface-500 font-medium text-sm">Wishlist Items</p>
            </motion.div>
          </div>

          {/* Main Settings Column (Right) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] shadow-premium border border-surface-100 overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-surface-100 bg-surface-50/50 p-2 gap-2">
                <button 
                  onClick={() => setActiveTab('general')} 
                  className={`flex-1 py-3 px-6 rounded-2xl font-bold text-sm transition-all ${activeTab === 'general' ? 'bg-white shadow-sm text-primary-600' : 'text-surface-500 hover:text-surface-900 hover:bg-white/50'}`}
                >
                  General Settings
                </button>
                <button 
                  onClick={() => setActiveTab('security')} 
                  className={`flex-1 py-3 px-6 rounded-2xl font-bold text-sm transition-all ${activeTab === 'security' ? 'bg-white shadow-sm text-primary-600' : 'text-surface-500 hover:text-surface-900 hover:bg-white/50'}`}
                >
                  Security
                </button>
              </div>

              <div className="p-8 lg:p-10">
                <AnimatePresence mode="wait">
                  {/* Messages */}
                  {(error || successMessage) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`p-4 rounded-2xl mb-8 border ${error ? 'bg-red-50 border-red-100 text-red-600' : 'bg-green-50 border-green-100 text-green-600'} font-medium flex items-center gap-3`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${error ? 'bg-red-100' : 'bg-green-100'}`}>
                        {error ? '!' : '✓'}
                      </div>
                      {error || successMessage}
                    </motion.div>
                  )}

                  {activeTab === 'general' ? (
                    <motion.form key="general" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-surface-600 uppercase tracking-widest">Full Name</label>
                        <div className="relative">
                          <input type="text" value={userData.name} onChange={e => setUserData({...userData, name: e.target.value})} className="input-premium pl-12" required />
                          <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-surface-600 uppercase tracking-widest">Email Address</label>
                        <div className="relative">
                          <input type="email" value={userData.email} onChange={e => setUserData({...userData, email: e.target.value})} className="input-premium pl-12" required />
                          <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-surface-600 uppercase tracking-widest">Account Type</label>
                        <div className="relative">
                          <select value={roleData} onChange={e => setRoleData(e.target.value as any)} className="input-premium pl-12 appearance-none">
                            <option value="customer">Customer</option>
                            <option value="seller">Seller</option>
                          </select>
                          <FaUserShield className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300" />
                        </div>
                      </div>

                      <button type="submit" className="btn-premium-primary w-full !py-4 mt-4">
                        <FaSave className="mr-2" /> Save Changes
                      </button>
                    </motion.form>
                  ) : (
                    <motion.form key="security" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleChangePassword} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-surface-600 uppercase tracking-widest">Current Password</label>
                        <div className="relative">
                          <input type="password" value={passwordData.currentPassword} onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} className="input-premium pl-12" required />
                          <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-surface-600 uppercase tracking-widest">New Password</label>
                        <div className="relative">
                          <input type="password" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} className="input-premium pl-12" required />
                          <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-surface-600 uppercase tracking-widest">Confirm New Password</label>
                        <div className="relative">
                          <input type="password" value={passwordData.confirmNewPassword} onChange={e => setPasswordData({...passwordData, confirmNewPassword: e.target.value})} className="input-premium pl-12" required />
                          <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300" />
                        </div>
                      </div>

                      <button type="submit" className="btn-premium-primary w-full !py-4 mt-4">
                        <FaKey className="mr-2" /> Update Password
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;