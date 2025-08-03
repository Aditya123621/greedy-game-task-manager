import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connectingDB = await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("There was an error connecting DB", error);
    process.exit(1);
  }
};
