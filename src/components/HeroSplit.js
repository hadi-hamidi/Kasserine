import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import TestimonialCard from './TestimonialCard';
import BookingForm from './BookingForm';
import './HeroSplit.css';

const HeroSplit = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  const heroImages = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      alt: 'مطاعم ومطابخ القصرين',
      title: 'مطعمنا'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      alt: 'أفضل المشاوي العربية',
      title: 'القائمة'
    }
  ];

  return (
    <section className="hero-split" id="home">
      <div className="hero-container">
        {heroImages.map((image, index) => (
          <motion.div
            key={image.id}
            className={`hero-frame ${index === 0 ? 'left-frame' : 'right-frame'}`}
            style={{
              y: index === 0 ? y : y,
              opacity: index === 0 ? opacity : 1
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          >
            {/* Background Image */}
            <div className="hero-image-container">
              <img
                src={image.src}
                alt={image.alt}
                className="hero-image"
              />
              <div className="image-overlay"></div>
            </div>

            {/* Floating Content */}
            <div className="floating-content">
              {index === 0 && (
                <motion.div
                  className="testimonial-container"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <TestimonialCard />
                </motion.div>
              )}

              {index === 1 && (
                <motion.div
                  className="booking-container"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  <BookingForm />
                </motion.div>
              )}
            </div>

            {/* Frame Title */}
            <motion.div
              className="frame-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 + index * 0.2 }}
            >
              <h2>{image.title}</h2>
            </motion.div>
          </motion.div>
        ))}

        {/* Navigation Dots */}
        <motion.div
          className="hero-dots"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          {[0, 1, 2, 3].map((dot) => (
            <motion.button
              key={dot}
              className={`dot ${dot === 0 ? 'active' : ''}`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="hero-copyright"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2 }}
        >
          <span>© منذ 1997</span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSplit;
