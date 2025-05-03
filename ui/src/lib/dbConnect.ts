// src/lib/dbConnect.ts
import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("Please add your MongoDB URI to .env.local");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    connection.isConnected = db.connections[0].readyState;
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB Connection Failed", error);
    throw error; // Rethrow to handle it in the calling function
  }
}

export default dbConnect;