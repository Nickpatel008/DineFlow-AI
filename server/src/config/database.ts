import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';

// PostgreSQL (Prisma)
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// MongoDB (Mongoose)
let mongoConnection: typeof mongoose | null = null;

export const connectMongoDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('⚠️ MongoDB URI not configured, skipping MongoDB connection');
      return null;
    }
    if (!mongoConnection) {
      mongoConnection = await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connected');
    }
    return mongoConnection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('⚠️ Continuing without MongoDB (optional for analytics)');
    return null;
  }
};

export const disconnectDatabases = async () => {
  await prisma.$disconnect();
  if (mongoConnection) {
    await mongoConnection.disconnect();
  }
};

