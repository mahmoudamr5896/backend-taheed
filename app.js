// ملف app.js

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const cors = require('cors'); // استيراد مكتبة cors

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());



const multer = require('multer'); // استيراد مكتبة multer
const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the 'uploads' directory

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });
// اتصال بقاعدة البيانات MongoDB    mongodb://localhost:27017/myapp
mongoose.connect('mongodb+srv://mahmoud:123@cluster0.0qd359r.mongodb.net/taheeddb', { });

// تعريف مخطط المستخدم
const userSchema = new mongoose.Schema({
  email: String,
  verificationCode: String,
  phone: String,
  fullName: String,
  nationalID: String,
  motorcycleCount: Number,
  receiptDocument: String,
  isVerified: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());

// مسار التسجيل
app.post('/register', async (req, res) => {
  try {
    const { email } = req.body;
    // إنشاء كود تحقق عشوائي
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // إرسال البريد الإلكتروني مع الكود
    // const transporter = nodemailer.createTransport({
    //         host: "sandbox.smtp.mailtrap.io",
    //         port: 587, //تأكد من استخدام المنفذ (port) الصحيح، عادة 2525 أو  أو .            ,
    //         auth: {
    //           user: "9bab2b70059de4",
    //           pass: "97547abce58fe0"
    //         }
    //       });
    const transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
          user: 'mohmmed.amr.hassan@outlook.com',
          pass: 'Mahmoudezat2030'
        }
          });
    
    const mailOptions = {
      from: 'mohmmed.amr.hassan@outlook.com',
      to: email,
      subject: 'Verification Code',
      text: `Your verification code is: ${verificationCode}`
    };
    
    await transporter.sendMail(mailOptions);
    
    // حفظ المستخدم مع الكود في قاعدة البيانات
    await User.create({ email, verificationCode });
    
    res.status(200).json({ message: 'Verification code sent successfully.' });
    console.log('Verification code sent successfully.',email)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// مسار التحقق من الرمز
app.post('/verify', async (req, res) => {
  try {
    const { email, verificationCode } = req.body;
    
    // البحث عن المستخدم باستخدام البريد الإلكتروني والرمز
    const user = await User.findOne({ email, verificationCode });
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid verification code.' });
    }
    
    // تحديث حالة التحقق للمستخدم
    user.isVerified = true;
    await user.save();
    
    res.status(200).json({ message: 'User verified successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// مسار استكمال التسجيل
app.post('/registration-complete', async (req, res) => {
  try {
    const { email, phone, fullName, nationalID, motorcycleCount, receiptDocument } = req.body;
    
    // البحث عن المستخدم باستخدام البريد الإلكتروني
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    // تحديث بيانات المستخدم
    user.phone = phone;
    user.fullName = fullName;
    user.nationalID = nationalID;
    user.motorcycleCount = motorcycleCount;
    user.receiptDocument = receiptDocument;
    
    await user.save();
    
    res.status(200).json({ message: 'User registration completed successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// مسار الحصول على مستخدم بواسطة ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// مسار حذف مستخدم بواسطة ID
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
