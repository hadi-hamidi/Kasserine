import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'الرئيسية', href: '#home' },
    { name: 'القائمة', href: '#menu' },
    { name: 'الحجوزات', href: '#reservations' },
    { name: 'من نحن', href: '#about' },
    { name: 'تواصل معنا', href: '#contact' }
  ];

  const socialIcons = [
    { name: 'Instagram', icon: '📷', href: 'https://www.instagram.com/alkasserine' },
    { name: 'Twitter', icon: '𝕏', href: 'https://twitter.com/alkasserine' },
    { name: 'TikTok', icon: '🎵', href: 'https://www.tiktok.com/@alkasserine' },
    { name: 'Snapchat', icon: '👻', href: 'https://www.snapchat.com/add/alkasserine' },
    { name: 'YouTube', icon: '▶️', href: 'https://www.youtube.com/@alkasserine' }
  ];

  return (
    <motion.header
      className={`header ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: 0 }}
      animate={{ y: isScrolled ? -100 : 0 }}
      transition={{ duration: 0.3, ease: [0.16, 0.84, 0.26, 1] }}
    >
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <motion.div
            className="logo"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <h1>القصرين</h1>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <ul>
              {navItems.map((item, index) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <a href={item.href}>{item.name}</a>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Right Side - Social & CTA */}
          <div className="header-right">
            {/* Admin Login Button */}
            <motion.a
              href="http://localhost:5000/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-login-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <span className="admin-icon">👨‍💼</span>
              <span className="admin-text">لوحة التحكم</span>
            </motion.a>

            {/* Booking CTA Button */}
            <motion.button
              className="booking-cta"
              whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(196, 154, 86, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              احجز طاولة
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <span></span>
              <span></span>
              <span></span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mobile-menu-content">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="mobile-nav-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </motion.a>
              ))}
              <motion.button
                className="mobile-booking-btn"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                احجز طاولة
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
