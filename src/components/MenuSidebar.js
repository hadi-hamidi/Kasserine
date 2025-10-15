import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DishCard from './DishCard';
import './MenuSidebar.css';

const MenuSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('appetizers');

  const menuCategories = {
    appetizers: {
      title: 'المقبلات',
      dishes: [
        {
          id: 1,
          name: 'حمص بالطحينة',
          description: 'حمص لبناني فاخر مع الطحينة وزيت الزيتون',
          price: '25',
          image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 2,
          name: 'متبل باذنجان',
          description: 'باذنجان مشوي مع الطحينة والثوم',
          price: '20',
          image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        }
      ]
    },
    grills: {
      title: 'المشاوي',
      dishes: [
        {
          id: 3,
          name: 'مشاوي مشكلة',
          description: 'تشكيلة من أفخر المشاوي (كباب، شيش طاووق، ريش)',
          price: '85',
          image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 4,
          name: 'كباب حلبي',
          description: 'كباب لحم مفروم مشوي على الفحم مع البصل والطماطم',
          price: '65',
          image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 5,
          name: 'شيش طاووق',
          description: 'قطع دجاج متبلة ومشوية على الفحم',
          price: '55',
          image: 'https://images.unsplash.com/photo-1633964913295-ceb43826d98e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        }
      ]
    },
    main: {
      title: 'الأطباق الرئيسية',
      dishes: [
        {
          id: 6,
          name: 'مندي لحم',
          description: 'أرز بخاري مع لحم غنم طري ومتبل',
          price: '75',
          image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 7,
          name: 'كبسة دجاج',
          description: 'أرز كبسة مع دجاج مشوي وصلصة خاصة',
          price: '55',
          image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        }
      ]
    },
    desserts: {
      title: 'الحلويات',
      dishes: [
        {
          id: 8,
          name: 'كنافة نابلسية',
          description: 'كنافة طازجة محشوة بالجبن مع القطر',
          price: '35',
          image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 9,
          name: 'أم علي',
          description: 'حلوى شرقية ساخنة بالحليب والمكسرات',
          price: '25',
          image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        }
      ]
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <section className="menu-sidebar-section" id="menu">
      {/* Menu Toggle Button */}
      <motion.button
        className="menu-toggle"
        onClick={toggleMenu}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <span className="menu-icon">🍽️</span>
        <span className="menu-text">القائمة</span>
      </motion.button>

      {/* Menu Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="menu-sidebar"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 0.84, 0.26, 1] }}
          >
            <div className="menu-content">
              {/* Header */}
              <motion.div
                className="menu-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2>قائمة الطعام</h2>
                <button
                  className="close-button"
                  onClick={toggleMenu}
                  aria-label="إغلاق القائمة"
                >
                  ✕
                </button>
              </motion.div>

              {/* Category Navigation */}
              <motion.div
                className="category-nav"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {Object.keys(menuCategories).map((category, index) => (
                  <motion.button
                    key={category}
                    className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {menuCategories[category].title}
                  </motion.button>
                ))}
              </motion.div>

              {/* Dishes Grid */}
              <motion.div
                className="dishes-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCategory}
                    className="dishes-grid"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {menuCategories[activeCategory].dishes.map((dish, index) => (
                      <motion.div
                        key={dish.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <DishCard dish={dish} />
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMenu}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default MenuSidebar;
