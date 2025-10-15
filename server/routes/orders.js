const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// @route   GET /api/orders
// @desc    Get all orders (Admin only)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    
    const orders = await Order.find(query)
      .populate('items.menuItem', 'name price image')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الطلبات',
      error: error.message
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.menuItem', 'name price image');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الطلب',
      error: error.message
    });
  }
});

// @route   POST /api/orders
// @desc    Create new order
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { customer, items, deliveryFee, paymentMethod, notes } = req.body;
    
    // حساب المجموع
    let total = 0;
    const orderItems = items.map(item => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      return {
        menuItem: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal
      };
    });
    
    total += deliveryFee || 0;
    
    const order = await Order.create({
      customer,
      items: orderItems,
      total,
      deliveryFee: deliveryFee || 0,
      paymentMethod: paymentMethod || 'cash',
      notes
    });
    
    res.status(201).json({
      success: true,
      message: 'تم إنشاء الطلب بنجاح',
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'خطأ في إنشاء الطلب',
      error: error.message
    });
  }
});

// @route   PUT /api/orders/:id
// @desc    Update order status
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { status, estimatedTime } = req.body;
    
    const updates = {};
    if (status) updates.status = status;
    if (estimatedTime) updates.estimatedTime = estimatedTime;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }
    
    res.json({
      success: true,
      message: 'تم تحديث الطلب بنجاح',
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'خطأ في تحديث الطلب',
      error: error.message
    });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Delete order
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'الطلب غير موجود'
      });
    }
    
    res.json({
      success: true,
      message: 'تم حذف الطلب بنجاح'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف الطلب',
      error: error.message
    });
  }
});

module.exports = router;
