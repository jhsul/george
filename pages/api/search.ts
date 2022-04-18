//@ts-nocheck
import nc from "next-connect";
import { db } from "../../middlewares/db";

const handler = nc();

handler.use(db);

handler.post(async (req, res) => {
  const { text } = req.body;
  if (!text) {
    res.status(400).end();
    return;
  }
  const results = await req.db
    .collection("search-terms")
    .aggregate([
      {
        $search: {
          index: "search-index",
          text: {
            query: text,
            fuzzy: {},
            path: {
              wildcard: "*",
            },
          },
        },
      },

      { $limit: 8 },
      {
        $project: { _id: 1, name: 1, type: 1, score: { $meta: "searchScore" } },
      },
    ])
    .toArray();

  console.table(results);

  res.json(results);
});

export default handler;
