import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Import routes
import restaurantRoutes from './modules/restaurant/restaurant.routes';
import ownerRoutes from './modules/owner/owner.routes';
import itemRoutes from './modules/item/item.routes';
import billingRoutes from './modules/billing/billing.routes';
import aiRoutes from './modules/ai/ai.routes';
import authRoutes from './modules/auth/auth.routes';
import tableRoutes from './modules/table/table.routes';
import subscriptionRoutes from './modules/subscription/subscription.routes';
import { connectMongoDB } from './config/database';

dotenv.config();

const __dirname = path.resolve();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DineFlow AI Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Initialize database connections
const startServer = async () => {
  try {
    // Connect to MongoDB (optional)
    await connectMongoDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 DineFlow AI Server running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;

