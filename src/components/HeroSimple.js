import React from 'react';
import { motion } from 'framer-motion';
import './HeroSimple.css';

const HeroSimple = () => {
  return (
    <section className="hero-simple" id="home">
      <div className="hero-simple-container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            مطاعم ومطابخ القصرين
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            تجربة مميزة للمأكولات العربية الأصيلة
          </motion.p>
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              className="hero-btn primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              استكشف القائمة
            </motion.button>
            <motion.button
              className="hero-btn secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              احجز طاولة
            </motion.button>
          </motion.div>
        </motion.div>

        <div className="hero-image-bg">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="مطعم القصرين"
          />
          <div className="hero-overlay"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSimple;
