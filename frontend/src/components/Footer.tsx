import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmex } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <span className="bg-blue-600 text-white rounded-lg px-2 py-1 mr-2">E</span>
              <h3 className="text-2xl font-bold">E-Shop</h3>
            </div>
            <p className="text-gray-400 mb-6 max-w-xs">
              Your trusted online shopping destination. Discover amazing products at unbeatable prices with fast delivery and excellent customer service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 hover:bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300">
                <FaFacebookF />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-blue-400 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300">
                <FaTwitter />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-pink-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300">
                <FaInstagram />
              </a>
              <a href="#" className="bg-gray-800 hover:bg-blue-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><span className="mr-2">•</span> Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><span className="mr-2">•</span> Products</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><span className="mr-2">•</span> About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><span className="mr-2">•</span> Contact</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><span className="mr-2">•</span> Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Customer Service</h4>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><span className="mr-2">•</span> Help Center</Link></li>
              <li><Link to="/returns" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><span className="mr-2">•</span> Returns & Exchanges</Link></li>
              <li><Link to="/shipping" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><span className="mr-2">•</span> Shipping Info</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><span className="mr-2">•</span> FAQ</Link></li>
              <li><Link to="/support" className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"><span className="mr-2">•</span> Live Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start">
                <span className="mr-3">📍</span>
                <span>123 Shopping Street, Retail City, RC 12345</span>
              </li>
              <li className="flex items-center">
                <span className="mr-3">📞</span>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <span className="mr-3">✉️</span>
                <span>support@eshop.com</span>
              </li>
              <li className="flex items-center">
                <span className="mr-3">🕒</span>
                <span>Mon-Fri: 9AM - 8PM, Sat-Sun: 10AM - 6PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment and policy section */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h5 className="text-lg font-semibold mb-4">Download Our App</h5>
              <div className="flex space-x-3">
                <button className="bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-2 flex items-center transition-colors duration-300">
                  <div className="mr-2">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Download on the</div>
                    <div className="text-sm font-medium">App Store</div>
                  </div>
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-2 flex items-center transition-colors duration-300">
                  <div className="mr-2">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Get it on</div>
                    <div className="text-sm font-medium">Google Play</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <h5 className="text-lg font-semibold mb-4">Secure Payments</h5>
              <div className="flex space-x-3">
                <FaCcVisa className="text-2xl text-gray-400" />
                <FaCcMastercard className="text-2xl text-gray-400" />
                <FaCcPaypal className="text-2xl text-gray-400" />
                <FaCcAmex className="text-2xl text-gray-400" />
              </div>
            </div>

            <div>
              <h5 className="text-lg font-semibold mb-4">Newsletter</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-gray-800 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg transition-colors duration-300">
                  Subscribe
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-2">
                Subscribe to get special offers, free giveaways, and new product alerts
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} E-Shop. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">Terms of Service</Link>
            <Link to="/cookies" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;