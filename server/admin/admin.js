// Global variables
let token = localStorage.getItem('adminToken');
let socket = null;
let currentChatSession = null;

// API Base URL
const API_URL = 'http://localhost:5000/api';

// Check login on load
document.addEventListener('DOMContentLoaded', async () => {
    if (token) {
        // التحقق من صلاحية الـ Token
        try {
            const response = await fetch(`${API_URL}/menu`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
        showDashboard();
        loadDashboardData();
            } else {
                // Token غير صالح - مسحه وإظهار صفحة تسجيل الدخول
                console.log('Token غير صالح، سيتم تسجيل الخروج...');
                localStorage.removeItem('adminToken');
                token = null;
                showLogin();
            }
        } catch (error) {
            console.error('خطأ في التحقق من Token:', error);
            localStorage.removeItem('adminToken');
            token = null;
            showLogin();
        }
    } else {
        showLogin();
    }
});

// Login Form
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            token = data.token;
            localStorage.setItem('adminToken', token);
            showDashboard();
            loadDashboardData();
        } else {
            alert(data.message || 'خطأ في تسجيل الدخول');
            // مسح الـ Token القديم إذا فشل تسجيل الدخول
            localStorage.removeItem('adminToken');
        }
    } catch (error) {
        alert('خطأ في الاتصال بالخادم');
        console.error(error);
        // مسح الـ Token القديم
        localStorage.removeItem('adminToken');
    }
});

// Logout
function logout() {
    localStorage.removeItem('adminToken');
    token = null;
    if (socket) socket.disconnect();
    showLogin();
}

// Show Login
function showLogin() {
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
}

// Show Dashboard
function showDashboard() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    connectSocket();
}

// Connect to Socket.io
function connectSocket() {
    socket = io('http://localhost:5000');
    
    socket.on('connect', () => {
        console.log('✅ متصل بالخادم');
        socket.emit('admin:join');
        loadChatSessions();
    });
    
    socket.on('admin:active-chats', (chats) => {
        console.log('📋 الدردشات النشطة:', chats);
        handleActiveChats(chats);
    });
    
    socket.on('customer:new', (data) => {
        console.log('👤 عميل جديد:', data);
        loadChatSessions();
        
        // إشعار صوتي (اختياري)
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzbB6/K0YB0ENo/S8diCNAoPUKXh8LJgHAU7k9nx0IQyDhFbquLyvWIfBja/6fK1XR0FM5DU8dKEMw4PUqbh8LVeHQU6lNjx0IMxDhBdq+LyvmsgBzbD7PGxWx0FM4/T8dKCMw4SVKfh8LZfHQU8l9nxz4IxDg5cquPyvW4gBjfG7/GtWBwEM4/S8dKBMg4SVKXg8LVfHQU7ldjxz4IxDg5bquLvvW0gBjXE7fGsWRwEM47R8dGBMg4RU6Xh8LVeHQY7lNfxzoExDg1bquDvvW0fBjXE7PGsWRwFM4vQ8dGBMg4RU6Tg77VdHQY7k9fxzoExDgxaquDvvW0fBjXD6/GsWRwFMorQ8dCAMg4RUqPg77VdHQY7k9fxzn8xDgxZqeDvvGwfBjXD6/GrWRwGMYnP8dCAMQ4QUqPg77RcHQY7k9bxzn8xDgxZqeDvu2wfBjXC6vGrWRwGMYnP8c+AMQ4QUaLf77RcHQY7k9bxzn8xDgxZqd/vu2weBjXC6vGrWBwGMYnO8c+AMQ4PUaLf77NcHQc7k9Xxxn4wDgxZqd/vumweBjXB6fGqWBwGMYnO8c9/MQ4PUKHf77NcHQc7k9Xxxn4wDgtZqd/uumweBjW/6PGqVxwGMInO8c9+MQ4OUKDf769cHQc6k9Xxxn0wDgtYqN/uumweBjW/5/GpVxwHMInN8c59MQ4OUJ/e769cHQc6ktXwxX0wDgtYp9/uuWweBjS+5/GoVhwGMInN8c18MQ0OUJ/e769cHQc6ktXwxXwvDgtXp9/tt2seBjS/5vGoVRwGMIjN8cx8MA0NUJ/e765bHgc6ktTwxnwvDgtXpt/ttWseBjS+5fGnVRwHMIfM8cx7MA0NUJ7e765bHgc5kdTwxnsvDgtWpt/ts2oeBjO+5fGmVBwHMIfM8ct7MA0MT57d765bHgc5kdTwxXsvDgtWpd7ts2oeBjO+5PCmUxwIMYfM8ct6Lw0MT57d76xaHgc5kdPwxXsuDgtVpd7tsmkeBjO+4/CmUxwIMYbL8cp6Lw0MTp3d76xZHgY5kdPwxHouDgtVpN7tsmkeBjK94/CmUhwJMIbL8cp5Lw0MTp3d76xZHgY5kdPwxHouDQtVpN7tsmkdBjK94/ClUhwJMIbL8cl5Lw0MTpzc76xZHgY5kNPww3ouDQtVo97tsmkdBjK94u+lURwJMIbL8cl5Lw0LTpzc76tZHgU5kNLww3ktDQtUo97tsWkdBjK94u+lURwJL4bL8cl4Lw0LTpzc76tYHgU5j9Lww3ktDQtUo97tsGgdBjG84u+kURwKL4bK8ch4Lw0LTZrb76tYHgU5j9Lww3ktDQtUo97sr2gdBjG84u+kUBwKL4bK8ch3Lw0KTJnb76pYHgU5j9Lww3csDAo=');
        audio.play().catch(() => {});
    });
    
    socket.on('customer:message', ({ customerId, customerName, message }) => {
        console.log('💬 رسالة جديدة من:', customerName);
        
        if (currentChatSession === customerId) {
            displayMessage(message);
        }
        
        loadChatSessions();
        
        // تحديث عدد الرسائل الجديدة
        updateNewMessagesCount();
    });
    
    socket.on('message:sent', (message) => {
        if (currentChatSession) {
            displayMessage(message);
        }
    });
    
    socket.on('message:history', (message) => {
        displayMessage(message);
    });
    
    socket.on('disconnect', () => {
        console.log('❌ انقطع الاتصال بالخادم');
    });
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        // Load stats
        const headers = { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        
        const [menuRes, ordersRes, reservationsRes] = await Promise.all([
            fetch(`${API_URL}/menu`, { headers }),
            fetch(`${API_URL}/orders`, { headers }),
            fetch(`${API_URL}/reservations`, { headers })
        ]);
        
        // التحقق من حالة الاستجابة
        if (menuRes.status === 401 || ordersRes.status === 401 || reservationsRes.status === 401) {
            console.log('Token غير صالح، سيتم تسجيل الخروج...');
            logout();
            return;
        }
        
        const menuData = await menuRes.json();
        const ordersData = await ordersRes.json();
        const reservationsData = await reservationsRes.json();
        
        // Update stats
        document.getElementById('menuItems').textContent = menuData.count || 0;
        document.getElementById('todayOrders').textContent = ordersData.count || 0;
        document.getElementById('upcomingReservations').textContent = reservationsData.count || 0;
        
        // Load tables
        loadMenuTable(menuData.data || []);
        loadCategoriesTable();
        loadOrdersTable(ordersData.data || []);
        loadReservationsTable(reservationsData.data || []);
        loadChatSessions();
    } catch (error) {
        console.error('خطأ في تحميل البيانات:', error);
    }
}

// Switch Tab
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

// Load Menu Table
function loadMenuTable(items) {
    const tbody = document.getElementById('menuTableBody');
    tbody.innerHTML = items.map(item => `
        <tr>
            <td><img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;"></td>
            <td><strong>${item.name}</strong></td>
            <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.description}</td>
            <td>${getCategoryName(item.category)}</td>
            <td><strong>${item.price} ر.س</strong></td>
            <td>${item.available ? '✅ متاح' : '❌ غير متاح'}</td>
            <td>
                <button class="btn btn-primary" onclick='editMenuItem(${JSON.stringify(item)})'>✏️ تعديل</button>
                <button class="btn btn-danger" onclick="deleteMenuItem('${item._id}')">🗑️ حذف</button>
            </td>
        </tr>
    `).join('');
}

// Load Orders Table
function loadOrdersTable(orders) {
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.orderNumber}</td>
            <td>${order.customer.name}</td>
            <td>${order.customer.phone}</td>
            <td>${order.total} ر.س</td>
            <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
            <td>${new Date(order.createdAt).toLocaleString('ar-SA')}</td>
            <td>
                <button class="btn btn-success" onclick="updateOrderStatus('${order._id}', 'confirmed')">تأكيد</button>
                <button class="btn btn-danger" onclick="deleteOrder('${order._id}')">حذف</button>
            </td>
        </tr>
    `).join('');
}

// Load Reservations Table
function loadReservationsTable(reservations) {
    const tbody = document.getElementById('reservationsTableBody');
    tbody.innerHTML = reservations.map(res => `
        <tr>
            <td>${res.customer.name}</td>
            <td>${res.customer.phone}</td>
            <td>${new Date(res.date).toLocaleDateString('ar-SA')}</td>
            <td>${res.time}</td>
            <td>${res.guests}</td>
            <td><span class="status-badge status-${res.status}">${getStatusText(res.status)}</span></td>
            <td>
                <button class="btn btn-success" onclick="updateReservationStatus('${res._id}', 'confirmed')">تأكيد</button>
                <button class="btn btn-danger" onclick="deleteReservation('${res._id}')">حذف</button>
            </td>
        </tr>
    `).join('');
}

// Load Chat Sessions
function loadChatSessions() {
    const sessionsList = document.getElementById('sessionsList');
    
    if (!socket || !socket.connected) {
        sessionsList.innerHTML = '<h3>الدردشات النشطة</h3><p style="color: #999; text-align: center; padding: 2rem;">لا توجد دردشات نشطة</p>';
        return;
    }
    
    // طلب القائمة من Socket
    socket.emit('admin:request-active-chats');
}

// Handle active chats list from socket
function handleActiveChats(chats) {
    const sessionsList = document.getElementById('sessionsList');
    
    if (!chats || chats.length === 0) {
        sessionsList.innerHTML = '<h3>الدردشات النشطة</h3><p style="color: #999; text-align: center; padding: 2rem;">لا توجد دردشات نشطة</p>';
        return;
    }
    
    sessionsList.innerHTML = '<h3>الدردشات النشطة</h3>' + 
        chats.map(chat => `
            <div class="session-item ${currentChatSession === chat.customerId ? 'active' : ''}" onclick="openChatSession('${chat.customerId}', '${chat.customerName}')">
                <div class="session-name">${chat.customerName || 'عميل'}</div>
                <div class="session-preview">${chat.lastMessage ? chat.lastMessage.message : 'لا توجد رسائل'}</div>
                ${chat.unreadCount > 0 ? `<span class="unread-badge">${chat.unreadCount}</span>` : ''}
            </div>
        `).join('');
}

// Open Chat Session
function openChatSession(customerId, customerName) {
    currentChatSession = customerId;
    
    console.log('📂 فتح دردشة:', customerName, customerId);
    
    // تفعيل الإدخال
    const input = document.getElementById('adminMessageInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatHeader = document.getElementById('chatHeader');
    const customerNameEl = document.getElementById('currentCustomerName');
    
    if (input) input.disabled = false;
    if (sendBtn) sendBtn.disabled = false;
    if (chatHeader) chatHeader.style.display = 'flex';
    if (customerNameEl) customerNameEl.textContent = customerName || 'عميل';
    
    // مسح الرسائل القديمة
    const chatArea = document.getElementById('chatMessagesAdmin');
    chatArea.innerHTML = '';
    
    // تحديث active state
    document.querySelectorAll('.session-item').forEach(item => {
        item.classList.remove('active');
    });
    event?.target?.closest('.session-item')?.classList.add('active');
    
    // طلب الرسائل من Socket
    if (socket && socket.connected) {
        socket.emit('admin:get-messages', { customerId });
    } else {
        chatArea.innerHTML = '<p style="text-align: center; color: #e74c3c; padding: 2rem;">❌ غير متصل بالخادم</p>';
    }
}

// End Chat
function endChat() {
    if (!confirm('هل تريد إنهاء هذه الدردشة؟')) return;
    
    if (currentChatSession && socket) {
        socket.emit('admin:end-chat', { customerId: currentChatSession });
    }
    
    currentChatSession = null;
    
    // تعطيل الإدخال
    document.getElementById('adminMessageInput').disabled = true;
    document.getElementById('sendBtn').disabled = true;
    document.getElementById('chatHeader').style.display = 'none';
    document.getElementById('chatMessagesAdmin').innerHTML = '<p style="text-align: center; color: #999; padding: 3rem;">اختر دردشة من القائمة للبدء</p>';
    
    loadChatSessions();
}

// Display message in chat
function displayMessage(message) {
    const chatArea = document.getElementById('chatMessagesAdmin');
    
    const messageDiv = document.createElement('div');
    messageDiv.style.marginBottom = '1rem';
    messageDiv.style.display = 'flex';
    messageDiv.style.justifyContent = message.sender === 'admin' ? 'flex-end' : 'flex-start';
    
    messageDiv.innerHTML = `
        <div style="background: ${message.sender === 'admin' ? '#c49a56' : '#f0f0f0'}; 
             color: ${message.sender === 'admin' ? 'white' : '#333'}; 
             padding: 0.875rem 1.125rem; 
             border-radius: 12px; 
             max-width: 70%;
             box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            ${message.message}
            <div style="font-size: 0.75rem; opacity: 0.7; margin-top: 0.25rem;">
                ${new Date(message.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
            </div>
        </div>
    `;
    
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Update new messages count
function updateNewMessagesCount() {
    // يمكن تحسينها لاحقاً
    const count = document.querySelectorAll('.unread-badge').length;
    document.getElementById('newMessages').textContent = count;
}

// Send Admin Message
function sendAdminMessage() {
    const input = document.getElementById('adminMessageInput');
    const message = input.value.trim();
    
    if (!message) {
        alert('الرجاء كتابة رسالة');
        return;
    }
    
    if (!currentChatSession) {
        alert('الرجاء اختيار دردشة أولاً');
        return;
    }
    
    if (!socket || !socket.connected) {
        alert('غير متصل بالخادم');
        return;
    }
    
    console.log('📤 إرسال رسالة للعميل:', currentChatSession);
    
    socket.emit('admin:message', {
        customerId: currentChatSession,
        message
    });
    
    input.value = '';
}

// Handle Enter key in admin input
document.addEventListener('DOMContentLoaded', () => {
    const adminInput = document.getElementById('adminMessageInput');
    if (adminInput) {
        adminInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendAdminMessage();
            }
        });
    }
});

// Append Message
function appendMessage(message) {
    const chatArea = document.getElementById('chatMessagesAdmin');
    chatArea.innerHTML += `
        <div class="message ${message.sender}" style="margin-bottom: 1rem;">
            <div style="background: ${message.sender === 'admin' ? '#c49a56' : '#f0f0f0'}; 
                 color: ${message.sender === 'admin' ? 'white' : '#333'}; 
                 padding: 0.75rem; 
                 border-radius: 12px; 
                 max-width: 70%; 
                 ${message.sender === 'admin' ? 'margin-left: auto;' : ''}">
                ${message.message}
            </div>
        </div>
    `;
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Helper Functions
function getCategoryName(category) {
    const names = {
        appetizers: 'مقبلات',
        grills: 'مشاوي',
        main: 'أطباق رئيسية',
        desserts: 'حلويات'
    };
    return names[category] || category;
}

function getStatusText(status) {
    const texts = {
        pending: 'قيد الانتظار',
        confirmed: 'مؤكد',
        preparing: 'قيد التحضير',
        ready: 'جاهز',
        delivering: 'قيد التوصيل',
        delivered: 'تم التوصيل',
        cancelled: 'ملغي',
        completed: 'مكتمل'
    };
    return texts[status] || status;
}

// Delete Functions
async function deleteMenuItem(id) {
    if (!confirm('هل أنت متأكد من حذف هذا الطبق؟')) return;
    
    try {
        const response = await fetch(`${API_URL}/menu/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        if (data.success) {
            alert('تم الحذف بنجاح');
            loadDashboardData();
        }
    } catch (error) {
        alert('خطأ في الحذف');
    }
}

async function deleteOrder(id) {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    
    try {
        const response = await fetch(`${API_URL}/orders/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        if (data.success) {
            alert('تم الحذف بنجاح');
            loadDashboardData();
        }
    } catch (error) {
        alert('خطأ في الحذف');
    }
}

async function deleteReservation(id) {
    if (!confirm('هل أنت متأكد من حذف هذا الحجز؟')) return;
    
    try {
        const response = await fetch(`${API_URL}/reservations/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        if (data.success) {
            alert('تم الحذف بنجاح');
            loadDashboardData();
        }
    } catch (error) {
        alert('خطأ في الحذف');
    }
}

async function updateOrderStatus(id, status) {
    try {
        const response = await fetch(`${API_URL}/orders/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        
        const data = await response.json();
        if (data.success) {
            loadDashboardData();
        }
    } catch (error) {
        alert('خطأ في التحديث');
    }
}

async function updateReservationStatus(id, status) {
    try {
        const response = await fetch(`${API_URL}/reservations/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        
        const data = await response.json();
        if (data.success) {
            loadDashboardData();
        }
    } catch (error) {
        alert('خطأ في التحديث');
    }
}

// Toggle Image Method
function toggleImageMethod() {
    const method = document.querySelector('input[name="imageMethod"]:checked').value;
    const urlSection = document.getElementById('imageUrlSection');
    const uploadSection = document.getElementById('imageUploadSection');
    const urlInput = document.getElementById('dishImageUrl');
    const fileInput = document.getElementById('dishImageFile');
    
    if (method === 'url') {
        urlSection.style.display = 'block';
        uploadSection.style.display = 'none';
        urlInput.required = true;
        fileInput.required = false;
        fileInput.value = '';
        document.getElementById('imagePreview').innerHTML = '';
    } else {
        urlSection.style.display = 'none';
        uploadSection.style.display = 'block';
        urlInput.required = false;
        fileInput.required = true;
        urlInput.value = '';
    }
}

// Preview uploaded image
document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('dishImageFile');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            const preview = document.getElementById('imagePreview');
            
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.innerHTML = `
                        <div style="text-align: center;">
                            <img src="${e.target.result}" alt="معاينة" style="max-width: 100%; max-height: 200px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                            <p style="margin-top: 0.5rem; color: #666; font-size: 0.875rem;">✅ تم اختيار الصورة</p>
                        </div>
                    `;
                };
                reader.readAsDataURL(file);
            } else {
                preview.innerHTML = '';
            }
        });
    }
});

// Load Categories into Dropdown
async function loadCategoriesDropdown() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const data = await response.json();
        
        const select = document.getElementById('dishCategory');
        select.innerHTML = '<option value="">اختر الفئة</option>';
        
        if (data.success && data.data) {
            data.data
                .filter(cat => cat.active)
                .sort((a, b) => a.order - b.order)
                .forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.key;
                    option.textContent = `${category.icon} ${category.name}`;
                    select.appendChild(option);
                });
        }
    } catch (error) {
        console.error('خطأ في تحميل الأقسام:', error);
    }
}

// Show Add Menu Item Modal
function showAddMenuItemModal() {
    document.getElementById('modalTitle').textContent = 'إضافة طبق جديد';
    document.getElementById('menuItemForm').reset();
    document.getElementById('menuItemId').value = '';
    document.getElementById('dishAvailable').checked = true;
    document.getElementById('dishPopular').checked = false;
    
    // Reset image method to URL (default)
    document.querySelector('input[name="imageMethod"][value="url"]').checked = true;
    toggleImageMethod();
    
    // Load categories
    loadCategoriesDropdown();
    
    document.getElementById('menuItemModal').classList.add('active');
}

// Edit Menu Item
async function editMenuItem(item) {
    document.getElementById('modalTitle').textContent = 'تعديل الطبق';
    document.getElementById('menuItemId').value = item._id;
    document.getElementById('dishName').value = item.name;
    document.getElementById('dishDescription').value = item.description;
    document.getElementById('dishPrice').value = item.price;
    document.getElementById('dishAvailable').checked = item.available;
    document.getElementById('dishPopular').checked = item.popular || false;
    
    // Load categories first
    await loadCategoriesDropdown();
    
    // Then set the category value
    document.getElementById('dishCategory').value = item.category;
    
    // Set image URL if exists
    if (item.image) {
        document.querySelector('input[name="imageMethod"][value="url"]').checked = true;
        document.getElementById('dishImageUrl').value = item.image;
        toggleImageMethod();
    }
    
    document.getElementById('menuItemModal').classList.add('active');
}

// Close Modal
function closeMenuItemModal() {
    document.getElementById('menuItemModal').classList.remove('active');
    document.getElementById('menuItemForm').reset();
}

// Save Menu Item
async function saveMenuItem(event) {
    event.preventDefault();
    
    const id = document.getElementById('menuItemId').value;
    const imageMethod = document.querySelector('input[name="imageMethod"]:checked').value;
    
    // Check which image method is selected
    let formData;
    let headers = { 'Authorization': `Bearer ${token}` };
    
    if (imageMethod === 'upload') {
        // Use FormData for file upload
        const fileInput = document.getElementById('dishImageFile');
        const file = fileInput.files[0];
        
        if (!file && !id) {
            alert('الرجاء اختيار صورة');
            return;
        }
        
        // First upload the image
        if (file) {
            const uploadFormData = new FormData();
            uploadFormData.append('image', file);
            
            try {
                const uploadResponse = await fetch(`${API_URL}/menu/upload`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: uploadFormData
                });
                
                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    alert('خطأ في رفع الصورة: ' + (errorData.message || 'حدث خطأ'));
                    return;
                }
                
                const uploadResult = await uploadResponse.json();
                if (!uploadResult.success) {
                    alert('خطأ في رفع الصورة: ' + uploadResult.message);
                    return;
                }
                
                // Now create the menu item with the uploaded image URL
                const data = {
                    name: document.getElementById('dishName').value,
                    description: document.getElementById('dishDescription').value,
                    price: parseFloat(document.getElementById('dishPrice').value),
                    category: document.getElementById('dishCategory').value,
                    available: document.getElementById('dishAvailable').checked,
                    popular: document.getElementById('dishPopular').checked,
                    image: uploadResult.imageUrl
                };
                
                formData = JSON.stringify(data);
                headers['Content-Type'] = 'application/json';
            } catch (error) {
                alert('خطأ في رفع الصورة: ' + error.message);
                return;
            }
        } else {
            // No file, create menu item without image
            const data = {
                name: document.getElementById('dishName').value,
                description: document.getElementById('dishDescription').value,
                price: parseFloat(document.getElementById('dishPrice').value),
                category: document.getElementById('dishCategory').value,
                available: document.getElementById('dishAvailable').checked,
                popular: document.getElementById('dishPopular').checked
            };
            
            formData = JSON.stringify(data);
            headers['Content-Type'] = 'application/json';
        }
    } else {
        // Use JSON for image URL
        const imageUrl = document.getElementById('dishImageUrl').value;
        
        if (!imageUrl && !id) {
            alert('الرجاء إدخال رابط الصورة');
            return;
        }
        
        const data = {
            name: document.getElementById('dishName').value,
            description: document.getElementById('dishDescription').value,
            price: parseFloat(document.getElementById('dishPrice').value),
            category: document.getElementById('dishCategory').value,
            available: document.getElementById('dishAvailable').checked,
            popular: document.getElementById('dishPopular').checked
        };
        
        if (imageUrl) {
            data.image = imageUrl;
        }
        
        formData = JSON.stringify(data);
        headers['Content-Type'] = 'application/json';
    }
    
    try {
        const url = id ? `${API_URL}/menu/${id}` : `${API_URL}/menu`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: headers,
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            alert('خطأ في إضافة الطبق:\n' + (errorData.message || 'حدث خطأ'));
            console.error('Error response:', errorData);
            return;
        }
        
        const result = await response.json();
        
        if (result.success) {
            alert(id ? 'تم تحديث الطبق بنجاح ✅' : 'تم إضافة الطبق بنجاح ✅');
            closeMenuItemModal();
            loadDashboardData();
        } else {
            alert('خطأ: ' + (result.message || 'حدث خطأ غير معروف'));
            console.error('Result error:', result);
        }
    } catch (error) {
        alert('خطأ في حفظ البيانات:\n' + error.message);
        console.error('Exception:', error);
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const menuModal = document.getElementById('menuItemModal');
    const categoryModal = document.getElementById('categoryModal');
    
    if (e.target === menuModal) {
        closeMenuItemModal();
    }
    if (e.target === categoryModal) {
        closeCategoryModal();
    }
});

// ===============================
// Categories Management
// ===============================

// Select Emoji
function selectEmoji(emoji) {
    const iconInput = document.getElementById('categoryIcon');
    if (iconInput) {
        iconInput.value = emoji;
        
        // Update selected state
        document.querySelectorAll('.emoji-btn').forEach(btn => {
            btn.classList.remove('selected');
            if (btn.textContent === emoji) {
                btn.classList.add('selected');
            }
        });
        
        // Add animation
        iconInput.style.transform = 'scale(1.2)';
        setTimeout(() => {
            iconInput.style.transform = 'scale(1)';
        }, 200);
    }
}

// Load Categories Table
async function loadCategoriesTable() {
    try {
        const response = await fetch(`${API_URL}/categories`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        const tbody = document.getElementById('categoriesTableBody');
        
        if (!data.data || data.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: #999;">لا توجد أقسام</td></tr>';
            return;
        }
        
        tbody.innerHTML = data.data.sort((a, b) => a.order - b.order).map(category => `
            <tr>
                <td style="font-size: 2rem;">${category.icon}</td>
                <td><strong>${category.name}</strong></td>
                <td><code style="background: #f0f0f0; padding: 0.25rem 0.5rem; border-radius: 4px;">${category.key}</code></td>
                <td>${category.order}</td>
                <td>${category.active ? '✅ نشط' : '❌ غير نشط'}</td>
                <td>
                    <button class="btn btn-primary" onclick='editCategory(${JSON.stringify(category)})'>✏️ تعديل</button>
                    <button class="btn btn-danger" onclick="deleteCategory('${category._id}')">🗑️ حذف</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('خطأ في تحميل الأقسام:', error);
    }
}

// Show Add Category Modal
function showAddCategoryModal() {
    document.getElementById('categoryModalTitle').textContent = 'إضافة قسم جديد';
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryActive').checked = true;
    document.getElementById('categoryModal').classList.add('active');
}

// Edit Category
function editCategory(category) {
    document.getElementById('categoryModalTitle').textContent = 'تعديل القسم';
    document.getElementById('categoryId').value = category._id;
    document.getElementById('categoryKey').value = category.key;
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryNameEn').value = category.nameEn || '';
    document.getElementById('categoryDescription').value = category.description || '';
    document.getElementById('categoryIcon').value = category.icon;
    document.getElementById('categoryOrder').value = category.order;
    document.getElementById('categoryActive').checked = category.active;
    
    // Highlight selected emoji
    document.querySelectorAll('.emoji-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.textContent === category.icon) {
            btn.classList.add('selected');
        }
    });
    
    document.getElementById('categoryModal').classList.add('active');
}

// Close Category Modal
function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('active');
    document.getElementById('categoryForm').reset();
}

// Save Category
async function saveCategory(event) {
    event.preventDefault();
    
    const id = document.getElementById('categoryId').value;
    const data = {
        key: document.getElementById('categoryKey').value.toLowerCase().trim(),
        name: document.getElementById('categoryName').value,
        nameEn: document.getElementById('categoryNameEn').value,
        description: document.getElementById('categoryDescription').value,
        icon: document.getElementById('categoryIcon').value,
        order: parseInt(document.getElementById('categoryOrder').value),
        active: document.getElementById('categoryActive').checked
    };
    
    try {
        const url = id ? `${API_URL}/categories/${id}` : `${API_URL}/categories`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(id ? 'تم تحديث القسم بنجاح ✅' : 'تم إضافة القسم بنجاح ✅');
            closeCategoryModal();
            loadCategoriesTable();
            loadDashboardData(); // تحديث القائمة أيضاً
        } else {
            alert('خطأ في إضافة القسم:\n' + result.message);
            console.error('Error details:', result);
        }
    } catch (error) {
        alert('خطأ في حفظ البيانات:\n' + error.message);
        console.error('Error:', error);
    }
}

// Delete Category
async function deleteCategory(id) {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟ سيتم حذف جميع الأطباق المرتبطة به!')) return;
    
    try {
        const response = await fetch(`${API_URL}/categories/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        if (data.success) {
            alert('تم الحذف بنجاح');
            loadCategoriesTable();
            loadDashboardData();
        }
    } catch (error) {
        alert('خطأ في الحذف');
    }
}
