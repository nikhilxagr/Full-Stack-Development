import mongoose from "mongoose";

export async function connect() {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    if (!process.env.MONGO_URI) {
      console.warn("MONGO_URI environment variable is missing.");
      return;
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Something went wrong while connecting to the database:", error);
  }
}

export default connect;