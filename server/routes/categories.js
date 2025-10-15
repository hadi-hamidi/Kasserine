const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect } = require('../middleware/auth');

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ active: true }).sort({ order: 1 });
    
    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الأقسام',
      error: error.message
    });
  }
});

// @route   GET /api/categories/:id
// @desc    Get single category
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'القسم غير موجود'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب القسم',
      error: error.message
    });
  }
});

// @route   POST /api/categories
// @desc    Create category
// @access  Private (Admin)
router.post('/', protect, async (req, res) => {
  try {
    const { key, name, nameEn, description, icon, order, active } = req.body;
    
    // التحقق من البيانات المطلوبة
    if (!key || !name || !icon) {
      return res.status(400).json({
        success: false,
        message: 'المفتاح والاسم والأيقونة مطلوبة'
      });
    }
    
    // التحقق من عدم وجود قسم بنفس المفتاح
    const existingCategory = await Category.findOne({ key: key.toLowerCase() });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'يوجد قسم بنفس المفتاح بالفعل'
      });
    }
    
    const category = await Category.create({
      key: key.toLowerCase(),
      name,
      nameEn: nameEn || '',
      description: description || '',
      icon,
      order: order || 0,
      active: active !== undefined ? active : true
    });
    
    res.status(201).json({
      success: true,
      message: 'تم إضافة القسم بنجاح',
      data: category
    });
  } catch (error) {
    console.error('خطأ في إضافة القسم:', error);
    
    // معالجة خطأ التكرار
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      return res.status(400).json({
        success: false,
        message: `القسم موجود بالفعل. يرجى استخدام ${field === 'key' ? 'مفتاح' : 'اسم'} مختلف`
      });
    }
    
    res.status(400).json({
      success: false,
      message: error.message || 'خطأ في إضافة القسم',
      error: error.message
    });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Private (Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const updates = { ...req.body };
    
    // تحويل المفتاح إلى حروف صغيرة
    if (updates.key) {
      updates.key = updates.key.toLowerCase();
    }
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'القسم غير موجود'
      });
    }
    
    res.json({
      success: true,
      message: 'تم تحديث القسم بنجاح',
      data: category
    });
  } catch (error) {
    console.error('خطأ في تحديث القسم:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'خطأ في تحديث القسم',
      error: error.message
    });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete category
// @access  Private (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'القسم غير موجود'
      });
    }
    
    res.json({
      success: true,
      message: 'تم حذف القسم بنجاح'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف القسم',
      error: error.message
    });
  }
});

module.exports = router;

