const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'اسم الطبق مطلوب'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'وصف الطبق مطلوب'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'السعر مطلوب'],
    min: [0, 'السعر يجب أن يكون أكبر من 0']
  },
  category: {
    type: String,
    required: [true, 'الفئة مطلوبة'],
    default: 'main'
  },
  image: {
    type: String,
    required: [true, 'صورة الطبق مطلوبة']
  },
  available: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  popular: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
menuItemSchema.index({ category: 1, available: 1 });
menuItemSchema.index({ popular: -1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
