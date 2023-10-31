import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.DATABASE_URL) {
    return console.log("DATABASE_URL not found");
  }

  if (!process.env.DATABASE_NAME) {
    return console.log("DATABASE_NAME not found");
  }

  if (isConnected) {
    return console.log("Database is already connected");
  }

  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      dbName: process.env.DB_DATABASE_NAME,
    });
  } catch (error) {
    console.log("Database connection error:", error);
  }
};
