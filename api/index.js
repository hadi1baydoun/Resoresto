
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
import multer from 'multer';
import fs from 'fs';
import sharp from 'sharp';


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


app.post('/api/upload-by-link', async (req, res) => {
  const { link } = req.body;

  // Implement image download logic here
  try {
    // Download the image from the provided link
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
      url: link,
      dest: path.join(__dirname, '/uploads', newName) // Save the image to the local 'uploads' directory
    });

    // If the image download is successful, respond with the new image URL
    const imageUrl = `http://localhost:4000/uploads/${newName}`; // Assuming your server is running locally on port 4000
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error downloading image:', error);
    res.status(500).json({ error: 'Failed to download image' });
  }
});



// const photoMiddleware = multer({dest:'uploads'});

// app.post('/uploads', photoMiddleware.array('photos', 1000), async (req, res) => {
//     try {
//         const uploadedFiles = [];
//         for (let i = 0; i < req.files.length; i++) {
//             const { path, originalname } = req.files[i];
//             const parts = originalname.split('.');
//             const ext = parts[parts.length - 1];
//             const newPath = path + '.' + ext;
//             fs.renameSync(path, newPath);

//             // Convert to .webp format using sharp
//             const webpPath = newPath.replace(/\.[^.]+$/, '.webp'); // Replace extension with .webp
//             await sharp(newPath).toFormat('webp').toFile(webpPath);

//             uploadedFiles.push(webpPath);
//         }
//         res.json(uploadedFiles);
//     } catch (error) {
//         console.error('Error uploading and converting files:', error);
//         res.status(500).json({ error: 'Failed to upload and convert files' });
//     }
// });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '/uploads'));
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// POST endpoint for uploading files
app.post('/uploads', upload.array('photos', 10), async (req, res) => {
  try {
      const uploadedFiles = [];

      // Process each uploaded file
      for (const file of req.files) {
          const imagePath = file.path;
          const filename = file.filename;

          // Perform image processing (e.g., convert to .webp format)
          const outputPath = imagePath + '.webp';
          await sharp(imagePath).toFormat('webp').toFile(outputPath);

          // Store the filename (with .webp extension) in the list of uploaded files
          uploadedFiles.push(path.basename(outputPath));
      }

      // Respond with the array of filenames
      res.json(uploadedFiles);
  } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({ error: 'Failed to upload files' });
  }
});


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
