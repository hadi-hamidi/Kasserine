const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const { protect } = require('../middleware/auth');

// @route   GET /api/chat/sessions
// @desc    Get all chat sessions (Admin only)
// @access  Private
router.get('/sessions', protect, async (req, res) => {
  try {
    const sessions = await ChatMessage.aggregate([
      {
        $group: {
          _id: '$sessionId',
          lastMessage: { $last: '$message' },
          lastMessageTime: { $last: '$createdAt' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$sender', 'customer'] }, { $eq: ['$read', false] }] },
                1,
                0
              ]
            }
          },
          customerName: { $first: '$customerInfo.name' }
        }
      },
      { $sort: { lastMessageTime: -1 } }
    ]);
    
    res.json({
      success: true,
      count: sessions.length,
      data: sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب جلسات الدردشة',
      error: error.message
    });
  }
});

// @route   GET /api/chat/:sessionId
// @desc    Get chat history
// @access  Public
router.get('/:sessionId', async (req, res) => {
  try {
    const messages = await ChatMessage.find({ 
      sessionId: req.params.sessionId 
    }).sort({ createdAt: 1 });
    
    res.json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الرسائل',
      error: error.message
    });
  }
});

// @route   POST /api/chat
// @desc    Save chat message
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { sessionId, sender, senderName, message, customerInfo } = req.body;
    
    const chatMessage = await ChatMessage.create({
      sessionId,
      sender,
      senderName: senderName || (sender === 'customer' ? 'عميل' : 'الدعم'),
      message,
      customerInfo
    });
    
    res.status(201).json({
      success: true,
      data: chatMessage
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'خطأ في حفظ الرسالة',
      error: error.message
    });
  }
});

// @route   PUT /api/chat/:sessionId/read
// @desc    Mark messages as read
// @access  Private
router.put('/:sessionId/read', protect, async (req, res) => {
  try {
    await ChatMessage.updateMany(
      { sessionId: req.params.sessionId, sender: 'customer', read: false },
      { read: true }
    );
    
    res.json({
      success: true,
      message: 'تم تحديث حالة القراءة'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في تحديث حالة القراءة',
      error: error.message
    });
  }
});

module.exports = router;
