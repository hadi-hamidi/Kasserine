const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  sender: {
    type: String,
    enum: ['customer', 'admin'],
    required: true
  },
  senderName: {
    type: String,
    default: 'عميل'
  },
  message: {
    type: String,
    required: [true, 'الرسالة مطلوبة'],
    trim: true
  },
  read: {
    type: Boolean,
    default: false
  },
  customerInfo: {
    name: String,
    phone: String
  }
}, {
  timestamps: true
});

// Index for faster queries
chatMessageSchema.index({ sessionId: 1, createdAt: -1 });
chatMessageSchema.index({ read: 1, sender: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
