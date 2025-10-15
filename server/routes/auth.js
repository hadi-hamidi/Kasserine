const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/login
// @desc    Admin login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني وكلمة المرور مطلوبان'
      });
    }
    
    // البحث عن الأدمن
    const admin = await Admin.findOne({ email }).select('+password');
    
    if (!admin || !admin.active) {
      return res.status(401).json({
        success: false,
        message: 'بيانات الدخول غير صحيحة'
      });
    }
    
    // التحقق من كلمة المرور
    const isPasswordMatch = await admin.comparePassword(password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'بيانات الدخول غير صحيحة'
      });
    }
    
    // تحديث آخر دخول
    admin.lastLogin = new Date();
    await admin.save();
    
    // إنشاء Token
    const token = generateToken(admin._id);
    
    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في تسجيل الدخول',
      error: error.message
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current admin
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    
    res.json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب البيانات',
      error: error.message
    });
  }
});

// @route   POST /api/auth/register
// @desc    Register new admin (Super Admin only)
// @access  Private (Super Admin)
router.post('/register', protect, async (req, res) => {
  try {
    // التحقق من أن المستخدم super-admin
    if (req.admin.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بإضافة مسؤولين جدد'
      });
    }
    
    const { name, email, password, role } = req.body;
    
    // التحقق من وجود الأدمن
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'البريد الإلكتروني مستخدم بالفعل'
      });
    }
    
    const admin = await Admin.create({
      name,
      email,
      password,
      role: role || 'admin'
    });
    
    res.status(201).json({
      success: true,
      message: 'تم إنشاء المسؤول بنجاح',
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'خطأ في إنشاء المسؤول',
      error: error.message
    });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change admin password
// @access  Private
router.post('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const admin = await Admin.findById(req.admin.id).select('+password');
    
    // التحقق من كلمة المرور الحالية
    const isPasswordMatch = await admin.comparePassword(currentPassword);
    
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'كلمة المرور الحالية غير صحيحة'
      });
    }
    
    admin.password = newPassword;
    await admin.save();
    
    res.json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'خطأ في تغيير كلمة المرور',
      error: error.message
    });
  }
});

module.exports = router;
