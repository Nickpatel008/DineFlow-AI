import express from 'express';
import { authenticate } from '../../utils/auth.middleware';
import {
  generateOffer,
  generateBusinessInsights,
  generateItemDescription
} from './ai.controller';

const router = express.Router();

router.post('/generate-offer', authenticate, generateOffer);
router.post('/business-insights', authenticate, generateBusinessInsights);
router.post('/item-description', authenticate, generateItemDescription);

export default router;















