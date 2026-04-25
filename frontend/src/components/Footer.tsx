import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmex, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Company',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Careers', path: '/careers' },
        { name: 'Sustainability', path: '/sustainability' },
        { name: 'Press Kit', path: '/press' },
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', path: '/help' },
        { name: 'Shipping Info', path: '/shipping' },
        { name: 'Returns & Exchanges', path: '/returns' },
        { name: 'Contact Us', path: '/contact' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Cookie Policy', path: '/cookies' },
        { name: 'Security', path: '/security' },
      ]
    }
  ];

  return (
    <footer className="bg-surface-900 pt-24 pb-12 overflow-hidden relative">
      {/* Decorative background circle */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/5 rounded-full blur-[100px] -mr-64 -mt-64" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-16 mb-20">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center group mb-8">
              <div className="bg-primary-600 text-white rounded-xl w-10 h-10 flex items-center justify-center font-bold text-xl mr-3 shadow-lg shadow-primary-500/20 group-hover:bg-primary-500 transition-colors">
                E
              </div>
              <span className="text-2xl font-display font-bold text-white">E-Shop</span>
            </Link>
            <p className="text-white/40 text-lg mb-8 leading-relaxed max-w-sm">
              Defining the next generation of online shopping. Premium quality, curated collections, and a seamless user experience.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <FaFacebookF />, hover: 'hover:bg-[#1877F2]' },
                { icon: <FaTwitter />, hover: 'hover:bg-[#1DA1F2]' },
                { icon: <FaInstagram />, hover: 'hover:bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]' },
                { icon: <FaLinkedinIn />, hover: 'hover:bg-[#0A66C2]' }
              ].map((s, i) => (
                <motion.a 
                  key={i}
                  whileHover={{ y: -4, scale: 1.1 }}
                  href="#" 
                  className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white transition-all duration-300 ${s.hover} shadow-sm`}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((col, i) => (
            <div key={i} className="lg:col-span-1">
              <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">{col.title}</h4>
              <ul className="space-y-4">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <Link to={link.path} className="text-white/40 hover:text-white transition-colors flex items-center group">
                      <div className="w-1 h-1 bg-primary-600 rounded-full mr-0 opacity-0 group-hover:mr-2 group-hover:opacity-100 transition-all duration-300" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact / App Column */}
          <div className="lg:col-span-1">
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Reach Out</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-400 shrink-0">
                  <FaEnvelope className="text-sm" />
                </div>
                <div>
                  <p className="text-white/30 text-[10px] uppercase font-bold tracking-tighter">Email Support</p>
                  <a href="mailto:support@eshop.com" className="text-white text-sm font-medium hover:text-primary-400 transition-colors">support@eshop.com</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent-400 shrink-0">
                  <FaPhoneAlt className="text-sm" />
                </div>
                <div>
                  <p className="text-white/30 text-[10px] uppercase font-bold tracking-tighter">Phone Line</p>
                  <a href="tel:+15551234567" className="text-white text-sm font-medium hover:text-accent-400 transition-colors">+1 (555) 123-4567</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
                  <FaMapMarkerAlt className="text-sm" />
                </div>
                <div>
                  <p className="text-white/30 text-[10px] uppercase font-bold tracking-tighter">Global HQ</p>
                  <p className="text-white text-sm font-medium">Retail City, RC 12345</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <p className="text-white/30 text-sm">&copy; {currentYear} E-Shop. Crafted with precision for the modern web.</p>
            <div className="flex gap-4">
              <FaCcVisa className="text-2xl text-white/10 hover:text-[#1A1F71] transition-colors" />
              <FaCcMastercard className="text-2xl text-white/10 hover:text-[#EB001B] transition-colors" />
              <FaCcPaypal className="text-2xl text-white/10 hover:text-[#003087] transition-colors" />
              <FaCcAmex className="text-2xl text-white/10 hover:text-[#0070CD] transition-colors" />
            </div>
          </div>
          
          <div className="flex gap-4">
            <button className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white hover:text-surface-900 transition-all duration-500 group">
              <div className="bg-white/10 group-hover:bg-surface-900/10 p-2 rounded-lg transition-colors">
                <div className="w-6 h-6 border-2 border-dashed border-current rounded-md" />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold opacity-50">Download on the</p>
                <p className="text-sm font-bold">App Store</p>
              </div>
            </button>
            <button className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white hover:text-surface-900 transition-all duration-500 group">
              <div className="bg-white/10 group-hover:bg-surface-900/10 p-2 rounded-lg transition-colors">
                 <div className="w-6 h-6 border-2 border-dashed border-current rounded-md" />
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase font-bold opacity-50">Get it on</p>
                <p className="text-sm font-bold">Google Play</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;