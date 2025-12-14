import express from 'express';
import { authenticate, requireRole } from '../../utils/auth.middleware';
import { upload } from '../../config/upload';
import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantStats,
  getPublicRestaurant
} from './restaurant.controller';

const router = express.Router();

// Public route for customers
router.get('/public/:id', getPublicRestaurant);

// Protected routes
router.post('/', authenticate, requireRole('admin'), upload.single('logo'), createRestaurant);
router.get('/', authenticate, getAllRestaurants);
router.get('/:id', authenticate, getRestaurantById);
router.put('/:id', authenticate, upload.single('logo'), updateRestaurant);
router.delete('/:id', authenticate, requireRole('admin'), deleteRestaurant);
router.get('/:id/stats', authenticate, getRestaurantStats);

export default router;

