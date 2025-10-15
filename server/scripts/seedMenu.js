const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
require('dotenv').config();

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alkasserine', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB متصل'))
.catch((err) => console.error('❌ خطأ في الاتصال:', err));

// قائمة الطعام التجريبية
const menuItems = [
  // المقبلات
  {
    name: 'حمص بالطحينة',
    description: 'حمص لبناني فاخر مع الطحينة وزيت الزيتون البكر والبهارات الخاصة',
    price: 25,
    category: 'appetizers',
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    available: true,
    popular: true
  },
  {
    name: 'متبل باذنجان',
    description: 'باذنجان مشوي على الفحم مع الطحينة والثوم والليمون',
    price: 20,
    category: 'appetizers',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    available: true
  },
  {
    name: 'فتوش',
    description: 'سلطة مشكلة مع الخضار الطازجة والخبز المحمص وصلصة الرمان',
    price: 22,
    category: 'appetizers',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    available: true
  },
  
  // المشاوي
  {
    name: 'مشاوي مشكلة',
    description: 'تشكيلة من أفخر المشاوي (كباب حلبي، شيش طاووق، ريش خروف) مشوية على الفحم',
    price: 85,
    category: 'grills',
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    available: true,
    popular: true
  },
  {
    name: 'كباب حلبي',
    description: 'كباب لحم مفروم مشوي على الفحم الحجري مع البصل المشوي والطماطم',
    price: 65,
    category: 'grills',
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    available: true,
    popular: true
  },
  {
    name: 'شيش طاووق',
    description: 'قطع صدور الدجاج الطرية متبلة بالليمون والثوم ومشوية على الفحم',
    price: 55,
    category: 'grills',
    image: 'https://images.unsplash.com/photo-1633964913295-ceb43826d98e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    available: true
  },
  {
    name: 'ريش خروف',
    description: 'ريش خروف طازجة متبلة بالتوابل الخاصة ومشوية حتى الكمال',
    price: 95,
    category: 'grills',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    available: true
  },
  
  // الأطباق الرئيسية
  {
    name: 'مندي لحم',
    description: 'أرز بخاري بالزعفران مع لحم غنم طري مطهو ببطء في الفرن التقليدي',
    price: 75,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    available: true,
    popular: true
  },
  {
    name: 'كبسة دجاج',
    description: 'أرز كبسة بالتوابل الخاصة مع دجاج مشوي وصلصة الدقوس',
    price: 55,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    available: true
  },
  {
    name: 'مظبي لحم',
    description: 'لحم غنم مشوي على الفحم مع أرز بخاري وسلطة يمنية',
    price: 80,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    available: true
  },
  
  // الحلويات
  {
    name: 'كنافة نابلسية',
    description: 'كنافة طازجة محشوة بالجبن الحلو ومغطاة بالقطر والفستق الحلبي',
    price: 35,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    available: true
  },
  {
    name: 'أم علي',
    description: 'حلوى شرقية ساخنة مع الحليب والمكسرات وجوز الهند والزبيب',
    price: 25,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    available: true
  },
  {
    name: 'بسبوسة بالقشطة',
    description: 'كيك السميد الذهبي مع القشطة والقطر وشرائح اللوز',
    price: 30,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    available: true
  }
];

async function seedMenu() {
  try {
    // حذف البيانات القديمة
    await MenuItem.deleteMany({});
    console.log('🗑️  تم حذف البيانات القديمة');
    
    // إضافة البيانات الجديدة
    await MenuItem.insertMany(menuItems);
    console.log('✅ تم إضافة القائمة بنجاح!');
    console.log(`📋 تم إضافة ${menuItems.length} طبق`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ في إضافة البيانات:', error);
    process.exit(1);
  }
}

seedMenu();
