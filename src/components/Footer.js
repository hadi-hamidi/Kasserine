import React from 'react';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  const footerLinks = {
    main: [
      { name: 'الرئيسية', href: '#home' },
      { name: 'القائمة', href: '#menu' },
      { name: 'من نحن', href: '#about' },
      { name: 'المطعم', href: '#restaurant' },
      { name: 'الحجوزات', href: '#reservations' }
    ]
  };

  const socialLinks = [
    { name: 'Instagram', href: 'https://www.instagram.com/alkasserine', icon: '📷' },
    { name: 'Twitter', href: 'https://twitter.com/alkasserine', icon: '𝕏' },
    { name: 'TikTok', href: 'https://www.tiktok.com/@alkasserine', icon: '🎵' },
    { name: 'Snapchat', href: 'https://www.snapchat.com/add/alkasserine', icon: '👻' },
    { name: 'YouTube', href: 'https://www.youtube.com/@alkasserine', icon: '▶️' }
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Main Navigation */}
          <motion.div
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h4>القائمة</h4>
            <nav className="footer-nav">
              {footerLinks.main.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="footer-link"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ color: '#c49a56', x: 5 }}
                >
                  {link.name}
                </motion.a>
              ))}
            </nav>
          </motion.div>


          {/* Social Links */}
          <motion.div
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4>تابعنا</h4>
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="social-link"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="social-icon">{social.icon}</span>
                  <span className="social-name">{social.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="footer-section contact-info"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4>تواصل معنا</h4>
            <div className="contact-details">
              <motion.p
                className="contact-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                📍 النقرة - الشفا
              </motion.p>
              <motion.p
                className="contact-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                📞 الرقم الموحد للحجوزات والحفلات
              </motion.p>
              <motion.p
                className="contact-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                🚗 خدمة التوصيل متاحة
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>© 2025 مطاعم ومطابخ القصرين. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
