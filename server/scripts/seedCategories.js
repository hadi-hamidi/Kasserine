const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

const categories = [
  {
    key: 'appetizers',
    name: 'المقبلات',
    nameEn: 'Appetizers',
    description: 'مقبلات شهية لبداية وجبتك',
    icon: '🥗',
    order: 1,
    active: true
  },
  {
    key: 'grills',
    name: 'المشاوي',
    nameEn: 'Grills',
    description: 'أفخر المشاوي المشوية على الفحم',
    icon: '🍖',
    order: 2,
    active: true
  },
  {
    key: 'main',
    name: 'الأطباق الرئيسية',
    nameEn: 'Main Dishes',
    description: 'أطباق رئيسية غنية ولذيذة',
    icon: '🍛',
    order: 3,
    active: true
  },
  {
    key: 'desserts',
    name: 'الحلويات',
    nameEn: 'Desserts',
    description: 'حلويات شرقية طازجة',
    icon: '🍰',
    order: 4,
    active: true
  }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alkasserine', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ MongoDB متصل');
    
    // حذف الأقسام الموجودة (اختياري)
    await Category.deleteMany({});
    console.log('🗑️  تم حذف الأقسام القديمة');
    
    // إضافة الأقسام الجديدة
    await Category.insertMany(categories);
    console.log('✅ تم إضافة الأقسام الافتراضية');
    
    console.log('\n📋 الأقسام المضافة:');
    categories.forEach(cat => {
      console.log(`   ${cat.icon} ${cat.name} (${cat.key})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ:', error);
    process.exit(1);
  }
};

seedCategories();

