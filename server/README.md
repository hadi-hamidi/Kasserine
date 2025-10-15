# Backend لمطعم القصرين

## 🚀 البدء السريع

### 1. تثبيت MongoDB

#### على Windows:
1. قم بتحميل MongoDB من [mongodb.com](https://www.mongodb.com/try/download/community)
2. ثبّت البرنامج
3. شغّل MongoDB:
```bash
mongod
```

#### أو استخدم MongoDB Atlas (السحابة - مجاني):
1. افتح [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. سجّل حساب مجاني
3. أنشئ Cluster جديد
4. احصل على رابط الاتصال

### 2. إعداد المشروع

```bash
cd server
npm install
```

### 3. إنشاء ملف .env

أنشئ ملف `.env` في مجلد `server` بهذا المحتوى:

```env
MONGODB_URI=mongodb://localhost:27017/alkasserine
PORT=5000
NODE_ENV=development
JWT_SECRET=alkasserine_super_secret_key_2025
ADMIN_EMAIL=admin@alkasserine.com
ADMIN_PASSWORD=Admin123!@#
FRONTEND_URL=http://localhost:3000
```

### 4. تشغيل الخادم

```bash
npm start
```

أو للتطوير (يعيد التشغيل تلقائياً):
```bash
npm run dev
```

الخادم سيعمل على: **http://localhost:5000**

---

## 📡 API Endpoints

### 🍽️ القائمة (Menu)

```
GET    /api/menu              - جلب جميع الأطباق
GET    /api/menu/:id          - جلب طبق واحد
POST   /api/menu              - إضافة طبق (يحتاج مصادقة)
PUT    /api/menu/:id          - تعديل طبق (يحتاج مصادقة)
DELETE /api/menu/:id          - حذف طبق (يحتاج مصادقة)
```

**مثال - جلب القائمة**:
```javascript
fetch('http://localhost:5000/api/menu')
  .then(res => res.json())
  .then(data => console.log(data));
```

**مثال - إضافة طبق**:
```javascript
fetch('http://localhost:5000/api/menu', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'كباب',
    description: 'كباب لحم طازج',
    price: 65,
    category: 'grills',
    image: 'https://example.com/image.jpg'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

### 🛒 الطلبات (Orders)

```
GET    /api/orders            - جلب جميع الطلبات (يحتاج مصادقة)
GET    /api/orders/:id        - جلب طلب واحد (يحتاج مصادقة)
POST   /api/orders            - إنشاء طلب جديد
PUT    /api/orders/:id        - تحديث حالة الطلب (يحتاج مصادقة)
DELETE /api/orders/:id        - حذف طلب (يحتاج مصادقة)
```

**مثال - إنشاء طلب**:
```javascript
fetch('http://localhost:5000/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customer: {
      name: 'أحمد',
      phone: '0501234567',
      address: 'الرياض، حي النخيل'
    },
    items: [
      {
        menuItemId: 'MENU_ITEM_ID',
        name: 'كباب',
        price: 65,
        quantity: 2
      }
    ],
    deliveryFee: 10,
    paymentMethod: 'cash'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

### 📅 الحجوزات (Reservations)

```
GET    /api/reservations      - جلب جميع الحجوزات (يحتاج مصادقة)
POST   /api/reservations      - إنشاء حجز جديد
PUT    /api/reservations/:id  - تحديث حجز (يحتاج مصادقة)
DELETE /api/reservations/:id  - حذف حجز (يحتاج مصادقة)
```

---

### 💬 الدردشة (Chat)

**Socket.io Events**:

**من العميل**:
- `customer:join` - الانضمام للدردشة
- `customer:message` - إرسال رسالة
- `customer:typing` - مؤشر الكتابة

**من الأدمن**:
- `admin:join` - انضمام الأدمن
- `admin:message` - إرسال رسالة للعميل
- `admin:typing` - مؤشر الكتابة

**HTTP Endpoints**:
```
GET    /api/chat/sessions     - جلب جلسات الدردشة (يحتاج مصادقة)
GET    /api/chat/:sessionId   - جلب رسائل جلسة
POST   /api/chat              - حفظ رسالة
PUT    /api/chat/:sessionId/read - تحديث حالة القراءة
```

---

### 🔐 المصادقة (Auth)

```
POST   /api/auth/login        - تسجيل دخول الأدمن
GET    /api/auth/me           - جلب معلومات الأدمن الحالي
POST   /api/auth/register     - إضافة أدمن جديد (Super Admin فقط)
POST   /api/auth/change-password - تغيير كلمة المرور
```

---

## 👨‍💼 لوحة التحكم

### الوصول للوحة التحكم:
افتح: **http://localhost:5000/admin**

### بيانات الدخول الافتراضية:
- **البريد الإلكتروني**: `admin@alkasserine.com`
- **كلمة المرور**: `Admin123!@#`

⚠️ **مهم**: غيّر كلمة المرور بعد أول تسجيل دخول!

### المميزات:
- ✅ إدارة قائمة الطعام (إضافة/تعديل/حذف)
- ✅ عرض الطلبات وتحديث حالتها
- ✅ إدارة الحجوزات
- ✅ الدردشة المباشرة مع العملاء
- ✅ إحصائيات في الوقت الفعلي

---

## 💬 نظام الدردشة المباشرة

### المميزات:
- ✅ دردشة فورية بين العميل والأدمن
- ✅ مؤشر الكتابة (Typing indicator)
- ✅ حفظ تاريخ الرسائل
- ✅ إشعارات الرسائل الجديدة
- ✅ دعم عدة عملاء في نفس الوقت

### كيف يعمل:
1. العميل يضغط على أيقونة الدردشة في الموقع
2. يدخل اسمه
3. يبدأ المحادثة
4. الأدمن يستقبل إشعار
5. الأدمن يرد من لوحة التحكم
6. الرسائل تُحفظ في قاعدة البيانات

---

## 📁 هيكل المشروع

```
server/
├── models/
│   ├── MenuItem.js        - نموذج الأطباق
│   ├── Order.js           - نموذج الطلبات
│   ├── Reservation.js     - نموذج الحجوزات
│   ├── ChatMessage.js     - نموذج الرسائل
│   └── Admin.js           - نموذج المسؤولين
├── routes/
│   ├── menu.js            - مسارات القائمة
│   ├── orders.js          - مسارات الطلبات
│   ├── reservations.js    - مسارات الحجوزات
│   ├── chat.js            - مسارات الدردشة
│   └── auth.js            - مسارات المصادقة
├── middleware/
│   └── auth.js            - middleware المصادقة
├── admin/
│   ├── index.html         - لوحة التحكم
│   └── admin.js           - سكريبت لوحة التحكم
├── uploads/               - مجلد الصور المرفوعة
├── server.js              - الملف الرئيسي
├── package.json
└── README.md
```

---

## 🔒 الأمان

### تم تطبيق:
- ✅ تشفير كلمات المرور (bcrypt)
- ✅ JWT للمصادقة
- ✅ Validation للبيانات
- ✅ CORS للحماية

### توصيات الإنتاج:
1. غيّر JWT_SECRET
2. استخدم HTTPS
3. فعّل Rate Limiting
4. استخدم Helmet.js
5. فعّل MongoDB Authentication

---

## 🚀 النشر

### على Heroku:
```bash
heroku create alkasserine-api
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
git push heroku main
```

### على Railway:
1. اربط GitHub
2. اختر المشروع
3. أضف متغيرات البيئة
4. انشر!

---

## 📞 الدعم

للمساعدة:
- 📧 البريد: support@alkasserine.com
- 💬 الدردشة: متاحة في الموقع

---

**بُني بـ ❤️ من أجل مطاعم القصرين**
