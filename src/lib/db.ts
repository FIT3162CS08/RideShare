import mongoose from "mongoose";

let cachedPromise: Promise<typeof mongoose> | null = null;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!cachedPromise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not set. Add it to .env.local");
    }
    cachedPromise = mongoose.connect(uri).then(() => mongoose);
  }
  return cachedPromise;
}


