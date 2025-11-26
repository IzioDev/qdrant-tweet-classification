import { OpenAI } from "openai";

export const getOpenAiClient = () => {
  return new OpenAI();
};

const client = getOpenAiClient();

export const embed = async (text: string) => {
  const res = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    encoding_format: "float",
  });

  const vector = res.data[0];

  if (!vector) {
    throw new Error("No vector returned");
  }

  return vector.embedding as number[];
};
