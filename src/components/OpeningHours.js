import React from 'react';
import { motion } from 'framer-motion';
import './OpeningHours.css';

const OpeningHours = () => {
  const schedule = [
    { day: 'الاثنين', hours: 'مغلق', isClosed: true },
    { day: 'الثلاثاء', hours: '16:00 - 22:00' },
    { day: 'الأربعاء', hours: '16:00 - 22:00' },
    { day: 'الخميس', hours: '16:00 - 22:00' },
    { day: 'الجمعة', hours: '17:00 - 22:00' },
    { day: 'السبت - الأحد', hours: '17:00 - 22:00' }
  ];

  return (
    <section className="opening-hours-section">
      <div className="container">
        <motion.div
          className="opening-hours-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h3
            className="opening-hours-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            ساعات العمل
          </motion.h3>

          <div className="hours-list">
            {schedule.map((item, index) => (
              <motion.div
                key={item.day}
                className={`hours-row ${item.isClosed ? 'closed' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <span className="day-name">{item.day}</span>
                <div className="dots-line"></div>
                <span className="hours-time">{item.hours}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OpeningHours;
