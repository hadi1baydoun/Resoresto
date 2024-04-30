
// import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';
// const mongoose = require('mongoose');
// require('dotenv').config()
// const app = express();

// app.use(express.json());
// app.use(cors({
//   credentials: true,
//   origin: 'http://localhost:5173'
// }));


// mongoose.connect(process.env.MONGO_URL);


// app.get('/test', (req, res) => {
//   res.json('test ok');
// });
// app.post('/register',(req,res)=>{
//   const {name,email,password} = req.body;
//   res.json({name,email,password});

// });



// app.listen(4000);

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import cookieParser from 'cookie-parser';
import imageDownloader from 'image-downloader';
import { fileURLToPath } from 'url';
import path from 'path';



// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'; // Use a default secret if not provided in env

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use(cors({
  credentials: true, // Allow sending cookies
  origin: 'http://localhost:5173' // Allow requests from this origin
}));

// Routes
app.get('/test', (req, res) => {
  res.json('test ok');
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const userDoc = await User.create({ name, email, password: hashedPassword });
    res.json({ userDoc });
  } catch (error) {
    res.status(422).json({ error: 'Registration failed', details: error.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      throw new Error('User not found');
    }
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (!passOk) {
      throw new Error('Incorrect password');
    }
    const token = jwt.sign({ email: userDoc.email, id: userDoc.id, name: userDoc.name }, JWT_SECRET);
    res.cookie('token', token, { httpOnly: true }).json({ user: { email: userDoc.email, name: userDoc.name } });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.get('/profile', async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const userData = await new Promise((resolve, reject) => {
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
    const {name,email,_id} = await User.findById(userData.id);
    res.json({ userData:{_id,email,name} });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});
app.post('/logout',(req,res)=>{
  res.cookie('token','').json(true);
})



app.post('/api/upload-by-link', async (req,res) => {
  const {link} = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  await imageDownloader.image({
    url: link,
    dest: '/uploads/' +newName,
  });
  const url = await uploadToS3('/uploads/' +newName, newName, mime.lookup('/uploads/' +newName));
  res.json(url);
});

// const photosMiddleware = multer({dest:'/uploads'});


// Connect to MongoDB
async function startServer() {
  try {
    await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1); // Exit process with failure
  }
}

startServer();
