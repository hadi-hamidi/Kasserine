const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  key: {
    type: String,
    required: [true, 'مفتاح الفئة مطلوب'],
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'اسم الفئة مطلوب'],
    trim: true
  },
  nameEn: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    default: '🍽️'
  },
  order: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index للترتيب
categorySchema.index({ order: 1 });

module.exports = mongoose.model('Category', categorySchema);

