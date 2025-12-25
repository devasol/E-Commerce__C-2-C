import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaUserShield, FaSave, FaKey } from 'react-icons/fa';

const Profile: React.FC = () => {
  const { state: authState, updateProfile, changePassword } = useAuth();
  const [userData, setUserData] = useState({
    name: authState.user?.name || '',
    email: authState.user?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (authState.user) {
      setUserData({
        name: authState.user.name || '',
        email: authState.user.email || ''
      });
    }
    document.title = 'My Profile - E-Shop';
  }, [authState.user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      await updateProfile(userData);
      setSuccessMessage('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setSuccessMessage('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-2xl">
            <motion.h1
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              My Profile
            </motion.h1>
            <motion.p
              className="text-xl text-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Manage your account information and settings
            </motion.p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <motion.div
              className="lg:col-span-2 bg-white rounded-xl shadow-sm p-8"
              variants={itemVariants}
            >
              <div className="flex items-center mb-6">
                <FaUser className="text-blue-600 text-2xl mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
              </div>

              {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center" role="alert">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {successMessage}
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center" role="alert">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleUpdateProfile}>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2 flex items-center">
                      <FaUser className="mr-2 text-gray-500" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                      className="input-modern"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 flex items-center">
                      <FaEnvelope className="mr-2 text-gray-500" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                      className="input-modern"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 flex items-center">
                      <FaUserShield className="mr-2 text-gray-500" />
                      Account Type
                    </label>
                    <input
                      type="text"
                      value={authState.user?.role || ''}
                      disabled
                      className="input-modern bg-gray-100"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary-modern flex items-center justify-center w-full py-3"
                  >
                    <FaSave className="mr-2" />
                    Update Profile
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Change Password */}
            <motion.div
              className="bg-white rounded-xl shadow-sm p-8"
              variants={itemVariants}
            >
              <div className="flex items-center mb-6">
                <FaKey className="text-blue-600 text-2xl mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
              </div>

              <form onSubmit={handleChangePassword}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 mb-2 flex items-center">
                      <FaLock className="mr-2 text-gray-500" />
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="input-modern"
                      placeholder="Current password"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 flex items-center">
                      <FaKey className="mr-2 text-gray-500" />
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="input-modern"
                      placeholder="New password"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 flex items-center">
                      <FaKey className="mr-2 text-gray-500" />
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmNewPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmNewPassword: e.target.value})}
                      className="input-modern"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary-modern flex items-center justify-center w-full py-3"
                  >
                    <FaKey className="mr-2" />
                    Change Password
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Account Stats */}
          <motion.div
            className="mt-8 bg-white rounded-xl shadow-sm p-8"
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">5</div>
                <div className="text-gray-600">Orders</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">$245.89</div>
                <div className="text-gray-600">Spent</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">2</div>
                <div className="text-gray-600">Wishlist Items</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;