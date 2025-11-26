import { qdrant, TWEET_COLLECTION } from "./qdrant";

export async function ensureCollection() {
  try {
    await qdrant.getCollection(TWEET_COLLECTION);
    return;
  } catch {
    await qdrant.createCollection(TWEET_COLLECTION, {
      vectors: {
        size: 1536, // warning: this depends on the embeddings model
        distance: "Cosine",
      },
    });
  }
}
