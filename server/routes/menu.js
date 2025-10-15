const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// إعداد Multer لرفع الصور
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/menu/');
  },
  filename: (req, file, cb) => {
    cb(null, `dish-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('فقط الصور مسموحة (jpeg, jpg, png, webp)'));
  }
});

// @route   GET /api/menu
// @desc    Get all menu items
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, available } = req.query;
    
    let query = {};
    if (category) query.category = category;
    if (available !== undefined) query.available = available === 'true';
    
    const menuItems = await MenuItem.find(query).sort({ category: 1, createdAt: -1 });
    
    res.json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب القائمة',
      error: error.message
    });
  }
});

// @route   GET /api/menu/:id
// @desc    Get single menu item
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'الطبق غير موجود'
      });
    }
    
    res.json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الطبق',
      error: error.message
    });
  }
});

// @route   POST /api/menu
// @desc    Create menu item
// @access  Private (Admin)
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, price, category, available, popular } = req.body;
    
    const menuItemData = {
      name,
      description,
      price: parseFloat(price),
      category,
      available: available === 'true' || available === true,
      popular: popular === 'true' || popular === true,
      image: req.body.image
    };
    
    const menuItem = await MenuItem.create(menuItemData);
    
    res.status(201).json({
      success: true,
      message: 'تم إضافة الطبق بنجاح',
      data: menuItem
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(400).json({
      success: false,
      message: 'خطأ في إضافة الطبق: ' + error.message,
      error: error.message
    });
  }
});

// @route   PUT /api/menu/:id
// @desc    Update menu item
// @access  Private (Admin)
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const updates = { ...req.body };
    
    if (req.file) {
      updates.image = `/uploads/menu/${req.file.filename}`;
    }
    
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'الطبق غير موجود'
      });
    }
    
    res.json({
      success: true,
      message: 'تم تحديث الطبق بنجاح',
      data: menuItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'خطأ في تحديث الطبق',
      error: error.message
    });
  }
});

// @route   DELETE /api/menu/:id
// @desc    Delete menu item
// @access  Private (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'الطبق غير موجود'
      });
    }
    
    res.json({
      success: true,
      message: 'تم حذف الطبق بنجاح'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف الطبق',
      error: error.message
    });
  }
});

// @route   POST /api/menu/upload
// @desc    Upload menu item image
// @access  Private (Admin)
router.post('/upload', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'لم يتم اختيار صورة'
      });
    }
    
    res.json({
      success: true,
      message: 'تم رفع الصورة بنجاح',
      imageUrl: `/uploads/menu/${req.file.filename}`
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'خطأ في رفع الصورة',
      error: error.message
    });
  }
});

module.exports = router;
