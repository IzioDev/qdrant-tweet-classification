import { QdrantClient } from "@qdrant/js-client-rest";

export const TWEET_COLLECTION = "tweets_semantic";

export const getQdrantClient = () => {
  return new QdrantClient({
    url: "http://localhost:6333",
  });
};

export const qdrant = getQdrantClient();
