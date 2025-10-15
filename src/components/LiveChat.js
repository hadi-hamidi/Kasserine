import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';
import './LiveChat.css';

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [showNameForm, setShowNameForm] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [customerId] = useState(`customer-${Date.now()}`);
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // الاتصال بالـ Socket
  useEffect(() => {
    if (isOpen && !socketRef.current) {
      socketRef.current = io('http://localhost:5000');
      
      socketRef.current.on('connect', () => {
        setIsConnected(true);
        console.log('✅ متصل بالخادم');
      });
      
      socketRef.current.on('disconnect', () => {
        setIsConnected(false);
        console.log('❌ انقطع الاتصال');
      });
      
      socketRef.current.on('message:received', (message) => {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      });
      
      socketRef.current.on('admin:typing', ({ isTyping }) => {
        setIsTyping(isTyping);
      });
      
      socketRef.current.on('chat:ended', ({ message }) => {
        // إضافة رسالة النظام
        setMessages(prev => [...prev, {
          id: 'system-' + Date.now(),
          sender: 'admin',
          message: message,
          timestamp: new Date()
        }]);
        
        // إغلاق الدردشة بعد 3 ثواني
        setTimeout(() => {
          setIsOpen(false);
          setShowNameForm(true);
          setMessages([]);
        }, 3000);
      });
    }
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isOpen]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // الانضمام للدردشة
  const handleJoinChat = (e) => {
    e.preventDefault();
    if (customerName.trim() && socketRef.current) {
      socketRef.current.emit('customer:join', {
        customerId,
        customerName: customerName.trim()
      });
      setShowNameForm(false);
      
      // رسالة ترحيبية
      setMessages([{
        id: 'welcome',
        sender: 'admin',
        message: `مرحباً ${customerName}! 👋\nكيف يمكنني مساعدتك اليوم؟`,
        timestamp: new Date()
      }]);
    }
  };

  // إرسال رسالة
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (inputMessage.trim() && socketRef.current) {
      socketRef.current.emit('customer:message', {
        customerId,
        message: inputMessage.trim()
      });
      
      setInputMessage('');
      
      // إيقاف مؤشر الكتابة
      socketRef.current.emit('customer:typing', {
        customerId,
        isTyping: false
      });
    }
  };

  // مؤشر الكتابة
  const handleTyping = (e) => {
    setInputMessage(e.target.value);
    
    if (socketRef.current) {
      socketRef.current.emit('customer:typing', {
        customerId,
        isTyping: true
      });
      
      // إيقاف المؤشر بعد ثانية من التوقف عن الكتابة
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current.emit('customer:typing', {
          customerId,
          isTyping: false
        });
      }, 1000);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        className="chat-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          y: isOpen ? 500 : 0 
        }}
      >
        {isOpen ? '✕' : '💬'}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-window"
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-info">
                <h3>دردشة مباشرة</h3>
                <span className={`status ${isConnected ? 'online' : 'offline'}`}>
                  {isConnected ? '🟢 متصل' : '🔴 غير متصل'}
                </span>
              </div>
              <button 
                className="chat-close-btn"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Name Form */}
            {showNameForm ? (
              <div className="chat-name-form">
                <h4>مرحباً بك! 👋</h4>
                <p>الرجاء إدخال اسمك للبدء</p>
                <form onSubmit={handleJoinChat}>
                  <input
                    type="text"
                    placeholder="اسمك"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    autoFocus
                  />
                  <button type="submit">ابدأ المحادثة</button>
                </form>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="chat-messages">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      className={`message ${msg.sender}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="message-content">
                        {msg.message}
                      </div>
                      <div className="message-time">
                        {new Date(msg.timestamp).toLocaleTimeString('ar-SA', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      className="typing-indicator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <span></span>
                      <span></span>
                      <span></span>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form className="chat-input-form" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    placeholder="اكتب رسالتك..."
                    value={inputMessage}
                    onChange={handleTyping}
                    disabled={!isConnected}
                  />
                  <button 
                    type="submit" 
                    disabled={!inputMessage.trim() || !isConnected}
                  >
                    إرسال
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveChat;
