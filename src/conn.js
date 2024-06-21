import mongoose from 'mongoose';
import { DB } from './config/env.config.js';

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB);
    console.log("Database connection successful!");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

connectToDatabase();
