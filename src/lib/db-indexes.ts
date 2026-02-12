import { getDb } from "./mongodb";

export async function ensureIndexes() {
  const db = await getDb();

  // users
  await db.collection("users").createIndex({ firebaseUid: 1 }, { unique: true });

  // problems
  await db.collection("problems").createIndex({ compositeScore: -1 });
  await db.collection("problems").createIndex({ category: 1, compositeScore: -1 });
  await db.collection("problems").createIndex({ createdAt: -1 });
  await db.collection("problems").createIndex({ userId: 1 });

  // problemUpvotes
  await db
    .collection("problemUpvotes")
    .createIndex({ problemId: 1, userId: 1 }, { unique: true });

  // problemPaySignals
  await db
    .collection("problemPaySignals")
    .createIndex({ problemId: 1, userId: 1 }, { unique: true });

  // problemAlternatives
  await db.collection("problemAlternatives").createIndex({ problemId: 1 });

  // solutions
  await db.collection("solutions").createIndex({ problemId: 1 });
  await db.collection("solutions").createIndex({ userId: 1 });

  // solutionUpvotes
  await db
    .collection("solutionUpvotes")
    .createIndex({ solutionId: 1, userId: 1 }, { unique: true });
}
