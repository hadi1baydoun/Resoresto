// import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import User from './models/User.js';
// import cookieParser from 'cookie-parser';
// import imageDownloader from 'image-downloader';
// import { fileURLToPath } from 'url';
// import path from 'path';
// import multer from 'multer';
// import sharp from 'sharp';
// import fs from 'fs';
// import Place from './models/Place.js';

// // Load environment variables from .env file
// dotenv.config();

// // Initialize Express app
// const app = express();
// const PORT = process.env.PORT || 4000;
// const MONGO_URL = process.env.MONGO_URL;
// const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'; // Use a default secret if not provided in env

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Middleware
// app.use(express.json()); // Parse JSON bodies
// app.use(cookieParser()); // Parse cookies
// app.use('/uploads', express.static(__dirname + '/uploads'));
// app.use(cors({
//   credentials: true, // Allow sending cookies
//   origin: 'http://localhost:5173' // Allow requests from this origin
// }));

// // Routes
// app.get('/test', (req, res) => {
//   res.json('test ok');
// });

// // Register User
// app.post('/register', async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
//     const userDoc = await User.create({ name, email, password: hashedPassword });
//     res.json({ userDoc });
//   } catch (error) {
//     res.status(422).json({ error: 'Registration failed', details: error.message });
//   }
// });

// // Login User
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const userDoc = await User.findOne({ email });
//     if (!userDoc) {
//       throw new Error('User not found');
//     }
//     const passOk = bcrypt.compareSync(password, userDoc.password);
//     if (!passOk) {
//       throw new Error('Incorrect password');
//     }
//     const token = jwt.sign({ email: userDoc.email, id: userDoc.id, name: userDoc.name }, JWT_SECRET);
//     res.cookie('token', token, { httpOnly: true }).json({ user: { email: userDoc.email, name: userDoc.name } });
//   } catch (error) {
//     res.status(401).json({ error: error.message });
//   }
// });

// // Profile Endpoint
// app.get('/profile', async (req, res) => {
//   const { token } = req.cookies;
//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }
//   try {
//     const userData = await new Promise((resolve, reject) => {
//       jwt.verify(token, JWT_SECRET, (err, decoded) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(decoded);
//         }
//       });
//     });
//     const { name, email, _id } = await User.findById(userData.id);
//     res.json({ userData: { _id, email, name } });
//   } catch (error) {
//     res.status(401).json({ error: 'Unauthorized' });
//   }
// });

// // Logout
// app.post('/logout', (req, res) => {
//   res.cookie('token', '').json(true);
// });

// // Upload by Link
// app.post('/api/upload-by-link', async (req, res) => {
//   const { link } = req.body;

//   try {
//     const newName = 'photo' + Date.now() + '.jpg';
//     await imageDownloader.image({
//       url: link,
//       dest: path.join(__dirname, '/uploads', newName)
//     });
//     const imageUrl = `http://localhost:4000/uploads/${newName}`;
//     res.json({ imageUrl });
//   } catch (error) {
//     console.error('Error downloading image:', error);
//     res.status(500).json({ error: 'Failed to download image' });
//   }
// });

// // Multer storage config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, '/uploads'));
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });
// const upload = multer({ storage });

// // Upload files
// app.post('/uploads', upload.array('photos', 10), async (req, res) => {
//   try {
//     const uploadedFiles = [];
//     for (const file of req.files) {
//       const imagePath = file.path;
//       const outputPath = imagePath + '.webp';
//       await sharp(imagePath).toFormat('webp').toFile(outputPath);
//       uploadedFiles.push(path.basename(outputPath));
//     }
//     res.json(uploadedFiles);
//   } catch (error) {
//     console.error('Error uploading files:', error);
//     res.status(500).json({ error: 'Failed to upload files' });
//   }
// });

// // Add new place
// app.post('/places', async (req, res) => {
//   const { token } = req.cookies;
//   const {
//     title,
//     address,
//     addedPhotos,
//     description,
//     perks,
//     extraInfo,
//     openHours,
//     closeHours,
//     numbPers
//   } = req.body;

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     const placeDoc = await Place.create({
//       owner: decoded.id,
//       title,
//       address,
//       photos: addedPhotos,
//       description,
//       perks,
//       extraInfo,
//       openHours,
//       closeHours,
//       numbPers
//     });
//     res.status(201).json({ place: placeDoc });
//   } catch (error) {
//     console.error('Error creating place:', error);
//     if (error.name === 'JsonWebTokenError') {
//       res.status(401).json({ error: 'Invalid token' });
//     } else {
//       res.status(500).json({ error: 'Failed to create place' });
//     }
//   }
// });

// // // Fetch user-specific places
// // app.get('/places', async (req, res) => {
// //   try {
// //     const { token } = req.cookies;
// //     const decoded = jwt.verify(token, JWT_SECRET);
// //     const places = await Place.find({ owner: decoded.id });
// //     res.json({ places });
// //   } catch (error) {
// //     console.error('Error fetching places:', error);
// //     if (error.name === 'JsonWebTokenError') {
// //       res.status(401).json({ error: 'Invalid token' });
// //     } else {
// //       res.status(500).json({ error: 'Failed to fetch places' });
// //     }
// //   }
// // });

// // Fetch a specific place by ID
// app.get('/places/:id', async (req, res) => {
//   const { id } = req.params; // Extract the place ID from the URL
//   try {
//     const place = await Place.findById(id);
//     if (!place) {
//       return res.status(404).json({ error: 'Place not found' }); // 404 if place doesn't exist
//     }
//     res.json(place); // Return the found place
//   } catch (error) {
//     console.error('Error fetching place by ID:', error);
//     if (error.name === 'CastError') {
//       return res.status(400).json({ error: 'Invalid place ID' }); // If ID is not a valid ObjectId
//     }
//     res.status(500).json({ error: 'Failed to fetch place' });
//   }
// });



// // Connect to MongoDB and start server
// async function startServer() {
//   try {
//     await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
//     console.log('Database connected successfully');
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error('Error connecting to database:', error);
//     process.exit(1);
//   }
// }

// startServer();


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
import sharp from 'sharp';
import fs from 'fs';
import Place from './models/Place.js';

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
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors({
  credentials: true, // Allow sending cookies
  origin: 'http://localhost:5173' // Allow requests from this origin
}));

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    req.user = decoded; // Attach decoded user to request object
    next();
  });
};

// Routes
app.get('/test', (req, res) => {
  res.json('test ok');
});

// Register User
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

// Login User
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

// Profile Endpoint
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
    const { name, email, _id } = await User.findById(userData.id);
    res.json({ userData: { _id, email, name } });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Logout
app.post('/logout', (req, res) => {
  res.cookie('token', '').json(true);
});

// Upload by Link
app.post('/api/upload-by-link', async (req, res) => {
  const { link } = req.body;

  try {
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
      url: link,
      dest: path.join(__dirname, '/uploads', newName)
    });
    const imageUrl = `http://localhost:4000/uploads/${newName}`;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error downloading image:', error);
    res.status(500).json({ error: 'Failed to download image' });
  }
});

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Upload files
app.post('/uploads', upload.array('photos', 10), async (req, res) => {
  try {
    const uploadedFiles = [];
    for (const file of req.files) {
      const imagePath = file.path;
      const outputPath = imagePath + '.webp';
      await sharp(imagePath).toFormat('webp').toFile(outputPath);
      uploadedFiles.push(path.basename(outputPath));
    }
    res.json(uploadedFiles);
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// Add new place
app.post('/places', authenticateToken, async (req, res) => {
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    openHours,
    closeHours,
    numbPers
  } = req.body;

  try {
    const placeDoc = await Place.create({
      owner: req.user.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      openHours,
      closeHours,
      numbPers
    });
    res.status(201).json({ place: placeDoc });
  } catch (error) {
    console.error('Error creating place:', error);
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: 'Invalid token' });
    } else {
      res.status(500).json({ error: 'Failed to create place' });
    }
  }
});

// Fetch user-specific places
app.get('/places', authenticateToken, async (req, res) => {
  try {
    const places = await Place.find({ owner: req.user.id });
    res.json({ places });
  } catch (error) {
    console.error('Error fetching places:', error);
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: 'Invalid token' });
    } else {
      res.status(500).json({ error: 'Failed to fetch places' });
    }
  }
});

// Fetch a specific place by ID
app.get('/places/:id', async (req, res) => {
  const { id } = req.params; // Extract the place ID from the URL
  try {
    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({ error: 'Place not found' }); // 404 if place doesn't exist
    }
    res.json(place); // Return the found place
  } catch (error) {
    console.error('Error fetching place by ID:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid place ID' }); // If ID is not a valid ObjectId
    }
    res.status(500).json({ error: 'Failed to fetch place' });
  }
});


app.delete('/places/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const place = await Place.findByIdAndDelete(id);
    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }

    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    console.error('Error deleting place with ID:', id, error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid place ID' });
    }
    res.status(500).json({ error: 'Failed to delete place' });
  }
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
}

startServer();
