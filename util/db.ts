import { Db, MongoClient } from "mongodb";

let db: Db;

export const getDb = async () => {
  if (db) return db;

  console.log("Connecting to mongo");

  const mongoClient = new MongoClient(process.env.MONGO_URI!);
  await mongoClient.connect();
  db = mongoClient.db("george");

  return db;
};
