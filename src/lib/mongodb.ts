import { MongoClient, Db } from "mongodb";

let cached: { client: MongoClient; db: Db } | null = null;

export async function getDb(): Promise<Db> {
  if (cached) {
    return cached.db;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  const client = await MongoClient.connect(uri);
  const db = client.db();

  cached = { client, db };
  return db;
}

export async function getCollection(name: string) {
  const db = await getDb();
  return db.collection(name);
}
