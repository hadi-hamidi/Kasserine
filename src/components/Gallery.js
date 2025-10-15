import React from 'react';
import { motion } from 'framer-motion';
import './Gallery.css';

const Gallery = () => {
  const images = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'أجواء المطعم الداخلية',
      title: 'أجواء مميزة'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'مشاوي طازجة',
      title: 'مشاوي على الفحم'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'أطباق شهية',
      title: 'أطباق متنوعة'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'طاولات المطعم',
      title: 'جلسات مريحة'
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1592861956120-e524fc739696?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'إضاءة دافئة',
      title: 'إضاءة مميزة'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      alt: 'ديكور عصري',
      title: 'تصميم عصري'
    }
  ];

  return (
    <section className="gallery" id="gallery">
      <div className="container">
        {/* Header */}
        <motion.div
          className="gallery-header"
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
            معرض الصور
          </motion.span>
          <h2>لحظات من تجربة القصرين</h2>
          <p>استمتع بجولة بصرية في أجواء مطعمنا وأطباقنا الشهية</p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              className="gallery-item"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="gallery-image-container">
                <img src={image.src} alt={image.alt} className="gallery-image" />
                <div className="gallery-overlay">
                  <motion.div
                    className="gallery-content"
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3>{image.title}</h3>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
