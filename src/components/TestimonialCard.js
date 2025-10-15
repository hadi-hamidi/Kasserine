import React from 'react';
import { motion } from 'framer-motion';
import './TestimonialCard.css';

const TestimonialCard = () => {
  const testimonial = {
    quote: "مطاعم ومطابخ القصرين",
    text: "تجربة مميزة للمأكولات العربية الأصيلة. الطعم رائع، الخدمة ممتازة، والأجواء مريحة. مطعم القصرين يقدم أفضل الأطباق التقليدية مع لمسة عصرية.",
    rating: 4.9,
    reviews: 2450,
    avatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&q=80',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&q=80',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&q=80'
    ]
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <motion.span
          key={i}
          className="star full"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          ★
        </motion.span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <motion.span
          key="half"
          className="star half"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: fullStars * 0.1 }}
        >
          ☆
        </motion.span>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <motion.span
          key={`empty-${i}`}
          className="star empty"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: (fullStars + (hasHalfStar ? 1 : 0) + i) * 0.1 }}
        >
          ☆
        </motion.span>
      );
    }

    return stars;
  };

  return (
    <motion.div
      className="testimonial-card"
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      whileHover={{ 
        y: -5,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
      }}
    >
      <div className="testimonial-content">
        {/* Quote */}
        <motion.h3
          className="testimonial-quote"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          "{testimonial.quote}"
        </motion.h3>

        {/* Text */}
        <motion.p
          className="testimonial-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {testimonial.text}
        </motion.p>

        {/* Rating and Reviews */}
        <motion.div
          className="testimonial-rating"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="stars">
            {renderStars(testimonial.rating)}
          </div>
          <div className="rating-info">
            <span className="rating-number">{testimonial.rating}</span>
            <span className="reviews-count">({testimonial.reviews} تقييم)</span>
          </div>
        </motion.div>

        {/* Avatars */}
        <motion.div
          className="testimonial-avatars"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          {testimonial.avatars.map((avatar, index) => (
            <motion.img
              key={index}
              src={avatar}
              alt={`عميل ${index + 1}`}
              className="avatar"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              whileHover={{ scale: 1.1, zIndex: 10 }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
