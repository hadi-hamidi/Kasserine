const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  customer: {
    name: {
      type: String,
      required: [true, 'اسم العميل مطلوب'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'رقم الهاتف مطلوب'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    }
  },
  date: {
    type: Date,
    required: [true, 'التاريخ مطلوب']
  },
  time: {
    type: String,
    required: [true, 'الوقت مطلوب']
  },
  guests: {
    type: Number,
    required: [true, 'عدد الضيوف مطلوب'],
    min: [1, 'يجب أن يكون هناك ضيف واحد على الأقل'],
    max: [20, 'الحد الأقصى 20 ضيف']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  },
  tableNumber: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
reservationSchema.index({ date: 1, time: 1 });
reservationSchema.index({ status: 1, date: -1 });

module.exports = mongoose.model('Reservation', reservationSchema);
