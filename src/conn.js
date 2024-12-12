import mongoose from 'mongoose';
import { MONGO_DB_URI } from './config/env.config.js';

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGO_DB_URI);
    console.log("Database connection successful!");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

connectToDatabase();