import express from 'express';
import { authenticate } from '../../utils/auth.middleware';
import { upload } from '../../config/upload';
import {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
  generateAIDescription,
  getPublicMenuItems
} from './item.controller';

const router = express.Router();

// Public route for customers (no auth required)
router.get('/public/:restaurantId', getPublicMenuItems);

// Protected routes (require authentication)
router.post('/', authenticate, upload.single('image'), createMenuItem);
router.get('/', authenticate, getMenuItems);
router.get('/:id', authenticate, getMenuItemById);
router.put('/:id', authenticate, upload.single('image'), updateMenuItem);
router.delete('/:id', authenticate, deleteMenuItem);
router.post('/:id/ai-description', authenticate, generateAIDescription);

export default router;

