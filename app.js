// ملف app.js
import express from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer'; // استيراد مكتبة multer
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ConnectionDatabase from './DB/connect.database.js';
import User from './DB/Models/Users.js'
import Userrouter from './Src/Modules/Users/users.router.js';

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(Userrouter)



ConnectionDatabase()

// Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ storage: storage });
// اتصال بقاعدة البيانات MongoDB    mongodb://localhost:27017/myapp

// تعريف مخطط المستخدم

app.use(bodyParser.json());



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append the file extension
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Return the URL of the uploaded file
  const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.status(200).json({ message: 'File uploaded successfully', fileUrl: fileUrl });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// const express = require('express');
// const bodyParser = require('body-parser');
// const nodemailer = require('nodemailer');
// const mongoose = require('mongoose');
// const cors = require('cors'); // استيراد مكتبة cors

// Serve static files from the uploads directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// const multer = require('multer'); // استيراد مكتبة multer
// const path = require('path');

// app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the 'uploads' directory
