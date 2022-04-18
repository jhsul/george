import { config } from "dotenv";
import express, { Request, Response } from "express";
import { MongoClient } from "mongodb";

config({ path: ".env.local" });

const port = 3001;
const app = express();

const mongoClient = new MongoClient(process.env.MONGO_URI!);
await mongoClient.connect();
const db = mongoClient.db("george");

console.log("Connected to Mongo :)");

app.use(express.json());

app.post("/search", async (req: Request, res: Response) => {
  const { input } = req.body;

  if (!input) {
    console.error(req.body);
    res.status(400).end();
    return;
  }

  console.log(`Searching: ${input}`);

  const results = await db
    .collection("professors")
    .aggregate([
      {
        $search: {
          index: "test",
          text: {
            query: input,
            fuzzy: {},
            path: {
              wildcard: "*",
            },
          },
        },
      },

      { $limit: 8 },
      { $project: { _id: 1, name: 1, score: { $meta: "searchScore" } } },
    ])
    .toArray();

  console.table(results);
  res.json(results);
});

app.listen(port, () => {
  console.log(`Listening on port ${port} 😀`);
});
