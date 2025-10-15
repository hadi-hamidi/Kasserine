import React from 'react';
import { motion } from 'framer-motion';
import './CTA.css';

const CTA = () => {
  return (
    <section className="cta">
      <div className="container">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="cta-icon"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            🍽️
          </motion.div>
          
          <h2>جرب تجربة القصرين الآن</h2>
          <p>اطلب الآن واستمتع بأشهى الأطباق العربية الأصيلة مع خدمة توصيل سريعة</p>
          
          <div className="cta-buttons">
            <motion.button
              className="cta-button primary"
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 10px 30px rgba(196, 154, 86, 0.4)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="button-icon">📱</span>
              اطلب الآن
            </motion.button>
            
            <motion.button
              className="cta-button secondary"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: 'rgba(196, 154, 86, 0.1)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="button-icon">📞</span>
              احجز طاولة
            </motion.button>
          </div>
          
          <motion.div
            className="cta-info"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="info-item">
              <span className="info-icon">⏰</span>
              <span className="info-text">خدمة سريعة</span>
            </div>
            <div className="info-item">
              <span className="info-icon">✨</span>
              <span className="info-text">جودة عالية</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🚚</span>
              <span className="info-text">توصيل مجاني</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
