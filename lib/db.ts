import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalWithMongoose = globalThis as typeof globalThis & {
  __mongoose?: MongooseCache;
};

const cache = globalWithMongoose.__mongoose ?? {
  conn: null,
  promise: null,
};

if (!globalWithMongoose.__mongoose) {
  globalWithMongoose.__mongoose = cache;
}

/**
 * Singleton connection suitable for Next.js App Router serverless workloads.
 */
export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "Missing MONGODB_URI. Add it to your environment (see .env.example).",
    );
  }
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, {
      bufferCommands: false,
    });
  }
  try {
    cache.conn = await cache.promise;
  } catch (e) {
    cache.promise = null;
    throw e;
  }
  return cache.conn;
}
