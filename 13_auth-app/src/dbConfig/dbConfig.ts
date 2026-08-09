import mongoose from "mongoose";

export async function connect() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!);
      const connection = mongoose.connection;

      connection.on('connected', () => {
        console.log('MongoDB connected successfully');
      });

      connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });

  } catch (error) {
    console.log('Something went wrong while connecting to the database:');
    console.log(error);
  }
}

export default connect;