import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './BookingForm.css';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Here you would typically send the data to your backend
    console.log('Booking data:', formData);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '2'
      });
    }, 3000);
  };

  const openingHours = [
    { day: 'الاثنين', hours: 'مغلق' },
    { day: 'الثلاثاء', hours: '16:00 - 22:00' },
    { day: 'الأربعاء', hours: '16:00 - 22:00' },
    { day: 'الخميس', hours: '16:00 - 22:00' },
    { day: 'الجمعة', hours: '17:00 - 22:00' },
    { day: 'السبت - الأحد', hours: '17:00 - 22:00' }
  ];

  return (
    <motion.div
      className="booking-form-container"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="booking-form-card">
        {/* Header */}
        <motion.div
          className="booking-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3>احجز طاولة</h3>
        </motion.div>

        {/* Form */}
        <motion.form
          className="booking-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="الاسم الكامل"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="البريد الإلكتروني"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phone"
              placeholder="رقم الهاتف"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <select
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                className="form-select"
              >
                <option value="">الوقت</option>
                <option value="16:00">4:00 م</option>
                <option value="17:00">5:00 م</option>
                <option value="18:00">6:00 م</option>
                <option value="19:00">7:00 م</option>
                <option value="20:00">8:00 م</option>
                <option value="21:00">9:00 م</option>
                <option value="22:00">10:00 م</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <select
              name="guests"
              value={formData.guests}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="1">شخص واحد</option>
              <option value="2">شخصان</option>
              <option value="3">3 أشخاص</option>
              <option value="4">4 أشخاص</option>
              <option value="5">5 أشخاص</option>
              <option value="6">6 أشخاص</option>
              <option value="7">7 أشخاص</option>
              <option value="8">8 أشخاص</option>
            </select>
          </div>

          <motion.button
            type="submit"
            className="submit-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitted}
          >
            {isSubmitted ? 'تم الإرسال!' : 'احجز الآن'}
          </motion.button>
        </motion.form>

        {/* Opening Hours */}
        <motion.div
          className="opening-hours"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h4>ساعات العمل</h4>
          <div className="hours-list">
            {openingHours.map((schedule, index) => (
              <motion.div
                key={schedule.day}
                className="hours-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + index * 0.1 }}
              >
                <span className="day">{schedule.day}</span>
                <span className="hours">{schedule.hours}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Made in Framer Badge */}
        <motion.div
          className="framer-badge"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <span>صُنع في Framer</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BookingForm;
