import mongoose from 'mongoose';
import { MONGO_URI } from '../constants.js';

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(MONGO_URI);
    console.log(
      `\nConnected to MongoDB ! DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
