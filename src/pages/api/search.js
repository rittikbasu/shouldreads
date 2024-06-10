import { getEmbedding } from "../../utils/embedding";
import { init } from "../../utils/db";

const db = init();

const search = async (text) => {
  const vector = await getEmbedding(text);
  const searchQuery = db.prepare(`
  SELECT rowid, distance
  FROM vss_aggregated_books
  WHERE vss_search(vector, ?)
  LIMIT 10;
`);

  const results = searchQuery.all(JSON.stringify(vector));
  return results;
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { query } = req.body;
      console.log("query", query);

      const similarBooks = await search(query);
      console.log("similarBooks", similarBooks);
      res.status(200).json(similarBooks);
    } catch (error) {
      console.error("Error searching for books:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
