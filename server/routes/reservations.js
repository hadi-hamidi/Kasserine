const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const { protect } = require('../middleware/auth');

// @route   GET /api/reservations
// @desc    Get all reservations (Admin only)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, date } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59);
      query.date = { $gte: startDate, $lte: endDate };
    }
    
    const reservations = await Reservation.find(query).sort({ date: 1, time: 1 });
    
    res.json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الحجوزات',
      error: error.message
    });
  }
});

// @route   POST /api/reservations
// @desc    Create new reservation
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { customer, date, time, guests, notes } = req.body;
    
    const reservation = await Reservation.create({
      customer,
      date,
      time,
      guests,
      notes
    });
    
    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحجز بنجاح',
      data: reservation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'خطأ في إنشاء الحجز',
      error: error.message
    });
  }
});

// @route   PUT /api/reservations/:id
// @desc    Update reservation
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'الحجز غير موجود'
      });
    }
    
    res.json({
      success: true,
      message: 'تم تحديث الحجز بنجاح',
      data: reservation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'خطأ في تحديث الحجز',
      error: error.message
    });
  }
});

// @route   DELETE /api/reservations/:id
// @desc    Delete reservation
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'الحجز غير موجود'
      });
    }
    
    res.json({
      success: true,
      message: 'تم حذف الحجز بنجاح'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف الحجز',
      error: error.message
    });
  }
});

module.exports = router;
