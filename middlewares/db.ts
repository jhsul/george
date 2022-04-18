//@ts-nocheck
import { MongoClient } from "mongodb";

global.mongo = global.mongo || {};

export const getMongoClient = async () => {
  //console.log(process.env.MONGO_URI);
  if (!global.mongo.client) {
    global.mongo.client = new MongoClient(process.env.MONGO_URI);
  }

  await global.mongo.client.connect();
  console.log("Connected to mongo");
  return global.mongo.client;
};

export const db = async (req, res, next) => {
  /*
  if (!global.mongo.client) {
    global.mongo.client = new MongoClient(process.env.MONGO_URI);
  }*/
  req.dbClient = await getMongoClient();
  req.db = req.dbClient.db("george-beta");

  // this use the database specified in the MONGODB_URI (after the "/")
  //if (!indexesCreated) await createIndexes(req.db);
  return next();
};
