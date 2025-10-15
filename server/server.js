const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/alkasserine', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB متصل بنجاح'))
.catch((err) => console.error('❌ خطأ في الاتصال بـ MongoDB:', err));

// Routes
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const reservationRoutes = require('./routes/reservations');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const categoryRoutes = require('./routes/categories');

app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/categories', categoryRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Admin Panel
app.use('/admin', express.static('admin'));

// Socket.io for Live Chat
const activeChats = new Map(); // { customerId: { socketId, messages, adminSocketId } }
const adminSockets = new Set();

io.on('connection', (socket) => {
  console.log('👤 مستخدم جديد متصل:', socket.id);

  // Customer joins chat
  socket.on('customer:join', (customerData) => {
    const { customerId, customerName } = customerData;
    activeChats.set(customerId, {
      socketId: socket.id,
      customerName: customerName || 'عميل',
      messages: [],
      adminSocketId: null,
      joinedAt: new Date()
    });
    
    socket.join(`customer:${customerId}`);
    
    // إشعار الأدمن بعميل جديد
    adminSockets.forEach(adminSocketId => {
      io.to(adminSocketId).emit('customer:new', {
        customerId,
        customerName: customerName || 'عميل',
        joinedAt: new Date()
      });
    });
    
    console.log(`💬 عميل جديد: ${customerName} (${customerId})`);
  });

  // Admin joins
  socket.on('admin:join', () => {
    adminSockets.add(socket.id);
    socket.join('admins');
    
    // إرسال قائمة الدردشات النشطة للأدمن
    const activeCustomers = Array.from(activeChats.entries()).map(([id, data]) => ({
      customerId: id,
      customerName: data.customerName,
      lastMessage: data.messages[data.messages.length - 1],
      unreadCount: data.messages.filter(m => !m.read && m.sender === 'customer').length,
      messageCount: data.messages.length
    }));
    
    socket.emit('admin:active-chats', activeCustomers);
    console.log('👨‍💼 أدمن متصل:', socket.id, '- دردشات نشطة:', activeCustomers.length);
  });
  
  // Admin requests active chats
  socket.on('admin:request-active-chats', () => {
    const activeCustomers = Array.from(activeChats.entries()).map(([id, data]) => ({
      customerId: id,
      customerName: data.customerName,
      lastMessage: data.messages[data.messages.length - 1],
      unreadCount: data.messages.filter(m => !m.read && m.sender === 'customer').length,
      messageCount: data.messages.length
    }));
    
    socket.emit('admin:active-chats', activeCustomers);
  });
  
  // Admin gets messages for a session
  socket.on('admin:get-messages', ({ customerId }) => {
    const chat = activeChats.get(customerId);
    if (chat) {
      chat.messages.forEach(msg => {
        socket.emit('message:history', msg);
      });
    }
  });

  // Customer sends message
  socket.on('customer:message', ({ customerId, message }) => {
    const chat = activeChats.get(customerId);
    if (chat) {
      const messageData = {
        id: Date.now(),
        sender: 'customer',
        message,
        timestamp: new Date(),
        read: false
      };
      
      chat.messages.push(messageData);
      
      // إرسال للعميل
      io.to(`customer:${customerId}`).emit('message:received', messageData);
      
      // إرسال للأدمن
      adminSockets.forEach(adminSocketId => {
        io.to(adminSocketId).emit('customer:message', {
          customerId,
          customerName: chat.customerName,
          message: messageData
        });
      });
    }
  });

  // Admin sends message
  socket.on('admin:message', ({ customerId, message }) => {
    const chat = activeChats.get(customerId);
    if (chat) {
      const messageData = {
        id: Date.now(),
        sender: 'admin',
        message,
        timestamp: new Date(),
        read: false
      };
      
      chat.messages.push(messageData);
      chat.adminSocketId = socket.id;
      
      // إرسال للعميل
      io.to(`customer:${customerId}`).emit('message:received', messageData);
      
      // إرسال للأدمن (تأكيد)
      socket.emit('message:sent', messageData);
    }
  });

  // Customer typing indicator
  socket.on('customer:typing', ({ customerId, isTyping }) => {
    adminSockets.forEach(adminSocketId => {
      io.to(adminSocketId).emit('customer:typing', { customerId, isTyping });
    });
  });

  // Admin typing indicator
  socket.on('admin:typing', ({ customerId, isTyping }) => {
    io.to(`customer:${customerId}`).emit('admin:typing', { isTyping });
  });

  // Mark messages as read
  socket.on('messages:read', ({ customerId }) => {
    const chat = activeChats.get(customerId);
    if (chat) {
      chat.messages.forEach(msg => {
        if (!msg.read) msg.read = true;
      });
    }
  });

  // Admin ends chat
  socket.on('admin:end-chat', ({ customerId }) => {
    const chat = activeChats.get(customerId);
    if (chat) {
      // إشعار العميل بإنهاء الدردشة
      io.to(`customer:${customerId}`).emit('chat:ended', {
        message: 'تم إنهاء الدردشة من قبل الإدارة. شكراً لك! 🙏'
      });
      
      // حذف الدردشة
      activeChats.delete(customerId);
      
      console.log(`🔚 تم إنهاء دردشة: ${chat.customerName}`);
      
      // تحديث قائمة الدردشات للأدمنز
      const activeCustomers = Array.from(activeChats.entries()).map(([id, data]) => ({
        customerId: id,
        customerName: data.customerName,
        lastMessage: data.messages[data.messages.length - 1],
        unreadCount: data.messages.filter(m => !m.read && m.sender === 'customer').length
      }));
      
      adminSockets.forEach(adminSocketId => {
        io.to(adminSocketId).emit('admin:active-chats', activeCustomers);
      });
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    // إزالة الأدمن
    if (adminSockets.has(socket.id)) {
      adminSockets.delete(socket.id);
      console.log('👨‍💼 أدمن انقطع:', socket.id);
    }
    
    // إزالة العميل
    for (const [customerId, chat] of activeChats.entries()) {
      if (chat.socketId === socket.id) {
        console.log(`👤 عميل انقطع: ${chat.customerName}`);
        // يمكن الاحتفاظ بالدردشة لفترة
        // أو حذفها بعد فترة معينة
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'حدث خطأ في الخادم',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io ready for live chat`);
});
