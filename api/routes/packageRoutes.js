import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { createPackage, getPackages } from '../controllers/packageController.js';

const router = express.Router();

router.post('/', authenticateToken, createPackage); // Create a package
router.get('/', authenticateToken, getPackages); // Fetch user packages

export default router;
