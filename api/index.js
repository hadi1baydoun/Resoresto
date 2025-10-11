

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
import Booking from './models/Booking.js';
import WaitingList from './models/waitingList.js';
// import packageRoutes from './routes/packageRoutes.js';
// app.use('/packages', packageRoutes);


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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
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



app.post('/waiting-list', async (req, res) => {
  const { placeId, date, guests } = req.body;

  if (!placeId || !date || !guests) {
    return res.status(400).json({ error: 'placeId, date, and guests are required.' });
  }

  try {
    const waitingListEntry = await WaitingList.create({ placeId, date, guests });
    res.status(201).json({ message: 'Added to waiting list.', entry: waitingListEntry });
  } catch (error) {
    console.error('Error adding to waiting list:', error);
    res.status(500).json({ error: 'Failed to add to waiting list.' });
  }
});


app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({ error: err.message || 'An unexpected error occurred' });
});

// Multer storage configuration with file validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    console.log(file.mimetype); // Debugging
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Only JPEG, PNG, and WEBP files are allowed'), false);
    } else {
      cb(null, true);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // Example limit: 10MB
});


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



// Upload files
app.post('/uploads', upload.array('photos', 10), async (req, res) => {
  console.log(req.files);
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
    numbPers,
    tables,
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
      numbPers,
      tables,
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

app.put('/places/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    openHours,
    closeHours,
    numbPers,
  } = req.body;

  try {
    // const place = await Place.findById(id);
    // if (!place) {
    //   return res.status(404).json({ error: 'Place not found' });
    // }
    // if (place.owner.toString() !== req.user.id) {
    //   return res.status(403).json({ error: 'Unauthorized' });
    // }

          const place = await Place.findById(placeId);
      if (!place) {
        return res.status(404).json({ error: 'Place not found' });
      }

      if (place.tables <= 0) {
        return res.status(400).json({ error: 'No tables available' });
      }

      place.tables -= 1; // Decrease table count
      await place.save();


    // Update the place
    place.title = title || place.title;
    place.address = address || place.address;
    place.photos = addedPhotos || place.photos;
    place.description = description || place.description;
    place.perks = perks || place.perks;
    place.extraInfo = extraInfo || place.extraInfo;
    place.openHours = openHours || place.openHours;
    place.closeHours = closeHours || place.closeHours;
    place.numbPers = numbPers || place.numbPers;

    const updatedPlace = await place.save();
    res.json({ place: updatedPlace });
  } catch (error) {
    console.error('Error updating place:', error);
    res.status(500).json({ error: 'Failed to update place' });
  }
});
app.post('/account/bookings', authenticateToken, async (req, res) => {
  const { placeId, date, time, guests } = req.body;

  try {
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }

    if (place.tables <= 0) {
      return res.status(400).json({ error: 'No tables available' });
    }

    // Decrease the table count after successful booking
    place.tables -= 1;
    await place.save(); // Save the updated place

    // Create a reservation object
    const reservation = {
      userId: req.user.id,
      placeId,
      date,
      time,
      guests,
    };

    // Save the reservation to the database using the existing Booking model
    const bookingDoc = await Booking.create(reservation);
    res.status(201).json({ booking: bookingDoc });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
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
    const place = await Place.findById(id); // Find the place by its ID
    if (!place) {
      return res.status(404).json({ error: 'Place not found' }); // 404 if the place doesn't exist
    }

    // Respond with place details including the tables field
    res.json({
      ...place._doc, // Spread the place document
      tables: place.tables, // Add the tables field
    });
  } catch (error) {
    console.error('Error fetching place by ID:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid place ID' }); // Handle invalid ObjectId
    }
    res.status(500).json({ error: 'Failed to fetch place' }); // Handle other errors
  }
});

app.post("/waiting-list", async (req, res) => {
  const { placeId, date, guests } = req.body;

  try {
    const waitingListEntry = await WaitingList.create({
      placeId,
      date,
      guests,
    });

    res.status(201).send(waitingListEntry);
  } catch (error) {
    console.error("Error adding to waiting list:", error);
    res.status(500).send({ message: "Failed to join waiting list" });
  }
});



app.delete('/places/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  console.log("Place ID to delete:", id);  // Log the received ID
  if (!id) {
    return res.status(400).json({ error: 'Invalid place ID' });
  }

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





// Fetch all bookings for the logged-in user
app.get('/account/bookings', authenticateToken, (req, res) => {
  Booking.find({ userId: req.user.id })  // Make sure you're using the correct field
    .then((bookings) => {
      res.json(bookings);
    })
    .catch((error) => {
      console.error('Error fetching bookings:', error);
      res.status(500).send('Failed to fetch bookings');
    });
});
app.post("/reservations", async (req, res) => {
  const { placeId, date, guests, seatingPreference } = req.body;
  const place = await Place.findById(placeId);

  if (!place) {
    return res.status(404).json({ message: "Place not found." });
  }

  if (place.tables <= 0) {
    return res.status(400).json({ message: "No tables available. Join the waiting list." });
  }

  // Process reservation and update place.tables
  place.tables -= 1;
  await place.save();

  return res.status(201).json({ message: "Reservation successful!" });
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
