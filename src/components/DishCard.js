import React from 'react';
import { motion } from 'framer-motion';
import './DishCard.css';

const DishCard = ({ dish }) => {
  return (
    <motion.div
      className="dish-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="dish-image-container">
        <img
          src={dish.image}
          alt={dish.name}
          className="dish-image"
        />
      </div>

      <div className="dish-content">
        <div>
          <div className="dish-header">
            <h3 className="dish-name">{dish.name}</h3>
            <span className="dish-price">{dish.price} ر.س</span>
          </div>
          
          <p className="dish-description">{dish.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default DishCard;
