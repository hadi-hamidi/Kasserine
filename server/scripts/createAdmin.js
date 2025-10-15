const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alkasserine', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB متصل'))
.catch((err) => console.error('❌ خطأ في الاتصال:', err));

// إنشاء أول أدمن
async function createFirstAdmin() {
  try {
    // التحقق من وجود أدمن
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL || 'admin@alkasserine.com' });
    
    if (existingAdmin) {
      console.log('⚠️  الأدمن موجود بالفعل');
      process.exit(0);
    }
    
    // إنشاء أدمن جديد
    const admin = await Admin.create({
      name: 'المدير العام',
      email: process.env.ADMIN_EMAIL || 'admin@alkasserine.com',
      password: process.env.ADMIN_PASSWORD || 'Admin123!@#',
      role: 'super-admin'
    });
    
    console.log('✅ تم إنشاء الأدمن بنجاح!');
    console.log('📧 البريد الإلكتروني:', admin.email);
    console.log('🔑 كلمة المرور:', process.env.ADMIN_PASSWORD || 'Admin123!@#');
    console.log('\n⚠️  الرجاء تغيير كلمة المرور بعد تسجيل الدخول!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ في إنشاء الأدمن:', error);
    process.exit(1);
  }
}

createFirstAdmin();
