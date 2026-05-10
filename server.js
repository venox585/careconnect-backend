const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// السماح للسيرفر بفهم البيانات واستقبالها
app.use(express.json());
app.use(cors());

// قاعدة بيانات مؤقتة جوه السيرفر
let users = []; 
let tasks = [
    { id: 1, text: 'صيانة إنارة الشارع الرئيسي', status: 'مكتمل' },
    { id: 2, text: 'إصلاح ماسورة مياه طارئة', status: 'قيد التنفيذ' }
];

// 1. مسار إنشاء حساب جديد
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    
    // التأكد إن المستخدم كتب بيانات
    if (!username || !password) {
        return res.status(400).json({ message: 'الرجاء إكمال جميع البيانات!' });
    }
    
    // التأكد إن الاسم مش مكرر
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'اسم المستخدم موجود بالفعل، اختر اسماً آخر.' });
    }
    
    // حفظ المستخدم الجديد
    users.push({ username, password });
    res.status(201).json({ message: 'تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن.' });
});

// 2. مسار تسجيل الدخول
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        return res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة.' });
    }
    
    res.json({ message: 'تم تسجيل الدخول بنجاح!', username: user.username });
});

// 3. مسارات عرض وإضافة الخدمات
app.get('/api/tasks', (req, res) => res.json(tasks));

app.post('/api/tasks', (req, res) => {
    const newTask = { id: Date.now(), text: req.body.text, status: 'جديد' };
    tasks.unshift(newTask); // إضافته في أول القائمة
    res.json(newTask);
});

// تشغيل السيرفر
app.listen(PORT, () => console.log(`السيرفر يعمل بنجاح على بورت ${PORT}...`));