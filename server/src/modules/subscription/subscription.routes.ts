import express from 'express';
import { authenticate } from '../../utils/auth.middleware';
import {
  getSubscriptionPlans,
  getSubscriptionPlanById,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  getRestaurantSubscription,
  createSubscription,
  cancelSubscription,
  getAllSubscriptions
} from './subscription.controller';

const router = express.Router();

// Public routes
router.get('/plans', getSubscriptionPlans);
router.get('/plans/:id', getSubscriptionPlanById);

// Owner routes
router.get('/restaurant', authenticate, getRestaurantSubscription);
router.post('/restaurant', authenticate, createSubscription);
router.post('/restaurant/cancel', authenticate, cancelSubscription);

// Admin routes
router.get('/', authenticate, getAllSubscriptions);
router.post('/plans', authenticate, createSubscriptionPlan);
router.put('/plans/:id', authenticate, updateSubscriptionPlan);

export default router;

