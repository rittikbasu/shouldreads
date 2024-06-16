import { getEmbedding } from "../../utils/embedding";
import { turso } from "@/utils/db";

const search = async (text) => {
  const queryEmbedding = JSON.stringify(await getEmbedding(text));
  const searchQuery = await turso.execute({
    sql: `
      SELECT id, vector_distance_cos(embedding, ?) AS distance
      FROM aggregated_books
      WHERE embedding IS NOT NULL
      AND distance < 0.68
      ORDER BY distance ASC
      LIMIT 10;
`,
    args: [queryEmbedding],
  });
  return searchQuery;
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { query } = req.body;
      console.log("query", query);

      const searchQuery = await search(query);
      const similarBooks = searchQuery.rows;
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
