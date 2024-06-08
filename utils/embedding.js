import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getEmbedding = async (text) => {
  const stringRaw = text.replace(/[\n\r]/g, " ");
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: stringRaw,
  });

  return response.data[0].embedding;
};
