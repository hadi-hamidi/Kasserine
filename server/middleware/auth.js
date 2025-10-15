const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // التحقق من وجود Token في Headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح لك بالوصول'
      });
    }
    
    // التحقق من Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // البحث عن الأدمن
    req.admin = await Admin.findById(decoded.id).select('-password');
    
    if (!req.admin || !req.admin.active) {
      return res.status(401).json({
        success: false,
        message: 'المستخدم غير موجود أو غير نشط'
      });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token غير صالح',
      error: error.message
    });
  }
};

// التحقق من Super Admin
exports.superAdminOnly = (req, res, next) => {
  if (req.admin.role !== 'super-admin') {
    return res.status(403).json({
      success: false,
      message: 'يجب أن تكون Super Admin'
    });
  }
  next();
};
