import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import './MenuSection.css';

const MenuSection = () => {
  const [menuData, setMenuData] = useState({
    appetizers: { title: 'المقبلات', dishes: [] },
    grills: { title: 'المشاوي', dishes: [] },
    main: { title: 'الأطباق الرئيسية', dishes: [] },
    desserts: { title: 'الحلويات', dishes: [] }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // جلب الأقسام والأطباق في نفس الوقت
        const [categoriesRes, menuRes] = await Promise.all([
          axios.get('http://localhost:5000/api/categories'),
          axios.get('http://localhost:5000/api/menu')
        ]);
        
        if (categoriesRes.data.success && menuRes.data.success) {
          const categories = categoriesRes.data.data.filter(cat => cat.active);
          const dishes = menuRes.data.data;
          
          // إنشاء كائن الأقسام ديناميكياً
          const groupedMenu = {};
          
          categories.forEach(category => {
            groupedMenu[category.key] = {
              title: category.name,
              icon: category.icon,
              dishes: []
            };
          });
          
          // تجميع الأطباق حسب الفئة
          dishes.forEach(dish => {
            if (dish.available && groupedMenu[dish.category]) {
              groupedMenu[dish.category].dishes.push({
                id: dish._id,
                name: dish.name,
                description: dish.description,
                price: dish.price,
                image: dish.image.startsWith('http') ? dish.image : `http://localhost:5000${dish.image}`,
                badge: dish.popular ? 'الأكثر طلباً' : null,
                tags: []
              });
            }
          });
          
          setMenuData(groupedMenu);
        }
        setLoading(false);
      } catch (err) {
        console.error('خطأ في جلب القائمة:', err);
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // عرض البيانات الثابتة الافتراضية إذا كانت القائمة فارغة
  const fallbackMenuData = {
    appetizers: {
      title: 'المقبلات',
      dishes: [
        {
          id: 1,
          name: 'حمص بالطحينة',
          description: 'حمص لبناني فاخر مع الطحينة وزيت الزيتون البكر والبهارات الخاصة',
          price: '25',
          image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          badge: 'الأكثر طلباً',
          tags: ['نباتي']
        },
        {
          id: 2,
          name: 'متبل باذنجان',
          description: 'باذنجان مشوي على الفحم مع الطحينة والثوم والليمون',
          price: '20',
          image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          tags: ['نباتي']
        },
        {
          id: 3,
          name: 'فتوش',
          description: 'سلطة مشكلة مع الخضار الطازجة والخبز المحمص وصلصة الرمان',
          price: '22',
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          tags: ['نباتي', 'طازج']
        }
      ]
    },
    grills: {
      title: 'المشاوي',
      dishes: [
        {
          id: 4,
          name: 'مشاوي مشكلة',
          description: 'تشكيلة من أفخر المشاوي (كباب حلبي، شيش طاووق، ريش خروف) مشوية على الفحم',
          price: '85',
          image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          badge: 'الأكثر طلباً',
          tags: ['مشوي']
        },
        {
          id: 5,
          name: 'كباب حلبي',
          description: 'كباب لحم مفروم مشوي على الفحم الحجري مع البصل المشوي والطماطم',
          price: '65',
          image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          tags: ['مشوي', 'حار']
        },
        {
          id: 6,
          name: 'شيش طاووق',
          description: 'قطع صدور الدجاج الطرية متبلة بالليمون والثوم ومشوية على الفحم',
          price: '55',
          image: 'https://images.unsplash.com/photo-1633964913295-ceb43826d98e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          tags: ['مشوي']
        },
        {
          id: 7,
          name: 'ريش خروف',
          description: 'ريش خروف طازجة متبلة بالتوابل الخاصة ومشوية حتى الكمال',
          price: '95',
          image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          badge: 'فخم',
          tags: ['مشوي']
        }
      ]
    },
    main: {
      title: 'الأطباق الرئيسية',
      dishes: [
        {
          id: 8,
          name: 'مندي لحم',
          description: 'أرز بخاري بالزعفران مع لحم غنم طري مطهو ببطء في الفرن التقليدي',
          price: '75',
          image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          badge: 'توصية الشيف',
          tags: ['مشوي']
        },
        {
          id: 9,
          name: 'كبسة دجاج',
          description: 'أرز كبسة بالتوابل الخاصة مع دجاج مشوي وصلصة الدقوس',
          price: '55',
          image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          badge: 'الأكثر طلباً',
          tags: ['حار']
        },
        {
          id: 10,
          name: 'مظبي لحم',
          description: 'لحم غنم مشوي على الفحم مع أرز بخاري وسلطة يمنية',
          price: '80',
          image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          tags: ['مشوي']
        }
      ]
    },
    desserts: {
      title: 'الحلويات',
      dishes: [
        {
          id: 11,
          name: 'كنافة نابلسية',
          description: 'كنافة طازجة محشوة بالجبن الحلو ومغطاة بالقطر والفستق الحلبي',
          price: '35',
          image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          badge: 'الأكثر طلباً',
          tags: ['طازج', 'ساخن']
        },
        {
          id: 12,
          name: 'أم علي',
          description: 'حلوى شرقية ساخنة مع الحليب والمكسرات وجوز الهند والزبيب',
          price: '25',
          image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          tags: ['ساخن']
        },
        {
          id: 13,
          name: 'بسبوسة بالقشطة',
          description: 'كيك السميد الذهبي مع القشطة والقطر وشرائح اللوز',
          price: '30',
          image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          badge: 'جديد',
          tags: ['طازج']
        }
      ]
    }
  };

  // استخدام البيانات من API أو البيانات الاحتياطية
  const displayData = Object.values(menuData).some(cat => cat.dishes.length > 0) 
    ? menuData 
    : fallbackMenuData;

  if (loading) {
    return (
      <section className="menu-page" id="menu">
        <div className="menu-page-container">
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#c49a56' }}>
            <h2>جاري تحميل القائمة...</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="menu-page" id="menu">
      <div className="menu-page-container">
        {/* Header */}
        <motion.div
          className="menu-page-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h1>القائمة</h1>
          <p>استكشف قائمتنا من الأطباق العربية الأصيلة المصنوعة من أفضل المكونات</p>
        </motion.div>

        {/* Menu Categories */}
        {Object.entries(displayData)
          .filter(([key, category]) => category.dishes && category.dishes.length > 0)
          .map(([key, category], categoryIndex) => (
          <div key={key} className="menu-category">
            <motion.h2
              className="category-title"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
            >
              {category.title}
            </motion.h2>

            <div className="dishes-list">
              {category.dishes.map((dish, index) => (
                <motion.div
                  key={dish.id}
                  className="menu-dish-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="menu-dish-image">
                    <img src={dish.image} alt={dish.name} />
                    {dish.badge && (
                      <div className="menu-dish-badge">{dish.badge}</div>
                    )}
                    <div className="menu-dish-overlay">
                      <button className="menu-order-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="9" cy="21" r="1"></circle>
                          <circle cx="20" cy="21" r="1"></circle>
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        إضافة للطلب
                      </button>
                    </div>
                  </div>

                  <div className="menu-dish-content">
                    <div className="menu-dish-header">
                      <h3>{dish.name}</h3>
                      <span className="menu-dish-price">
                        <span className="currency-symbol">﷼</span>
                        {dish.price}
                      </span>
                    </div>
                    <p className="menu-dish-description">{dish.description}</p>
                    {dish.tags && dish.tags.length > 0 && (
                      <div className="menu-dish-tags">
                        {dish.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="menu-dish-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MenuSection;
