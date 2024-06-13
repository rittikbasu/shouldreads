import { turso } from "@/utils/db";

export default async function handler(req, res) {
  const { bookId } = req.query;

  if (!bookId) {
    return res.status(400).json({ error: "Book ID is required" });
  }

  try {
    const response = await turso.execute({
      sql: `
          SELECT description
          FROM aggregated_books
          WHERE id = ?
        `,
      args: [bookId],
    });

    if (response.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    const description = response.rows[0].description;
    res.status(200).json({ description });
  } catch (error) {
    console.error("Error fetching book description:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
