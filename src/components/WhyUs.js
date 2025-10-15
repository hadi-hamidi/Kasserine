import React from 'react';
import { motion } from 'framer-motion';
import './WhyUs.css';

const WhyUs = () => {
  const features = [
    {
      id: 1,
      icon: '🔥',
      title: 'مشاوي على الفحم',
      description: 'نستخدم أفضل أنواع الفحم لإعطاء طعم مميز ونكهة أصيلة'
    },
    {
      id: 2,
      icon: '👨‍🍳',
      title: 'طهاة محترفون',
      description: 'فريق من أمهر الطهاة ذوي الخبرة الطويلة في المطبخ العربي'
    },
    {
      id: 3,
      icon: '🥩',
      title: 'مكونات طازجة',
      description: 'نختار أجود اللحوم والخضروات الطازجة يومياً'
    },
    {
      id: 4,
      icon: '🚗',
      title: 'خدمة توصيل سريعة',
      description: 'نصل إليك في أسرع وقت مع الحفاظ على جودة الطعام'
    },
    {
      id: 5,
      icon: '🎉',
      title: 'تنظيم الحفلات',
      description: 'نقدم خدمات تنظيم الحفلات والمناسبات الخاصة'
    },
    {
      id: 6,
      icon: '⭐',
      title: 'تقييم عالي',
      description: 'آلاف العملاء السعداء وتقييمات ممتازة على جميع المنصات'
    }
  ];

  return (
    <section className="why-us" id="about">
      <div className="container">
        {/* Header */}
        <motion.div
          className="why-us-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.span
            className="section-label"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            لماذا القصرين
          </motion.span>
          <h2>تجربة لا تُنسى من المذاق الأصيل</h2>
          <p>نجمع بين الأصالة والحداثة لنقدم لك أفضل تجربة طعام</p>
        </motion.div>

        {/* Features Grid */}
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -10,
                boxShadow: '0 20px 40px rgba(196, 154, 86, 0.2)'
              }}
            >
              <motion.div
                className="feature-icon"
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                {feature.icon}
              </motion.div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
