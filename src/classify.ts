import { Category } from "./category";
import { embed } from "./open-ai";
import { qdrant, TWEET_COLLECTION } from "./qdrant";

export async function chooseCategoriesFromCentroids(
  tweetEmbedding: number[],
): Promise<{ category: Category; score: number }[]> {
  const result = await qdrant.search(TWEET_COLLECTION, {
    vector: tweetEmbedding,
    limit: 1, // 1 tag max
    with_payload: true,
    filter: {
      must: [
        {
          key: "kind",
          match: { value: "category" },
        },
      ],
    },
    score_threshold: 0.7, // to be tweaked, higher = require closer similarities
  });

  const top = result?.[0];
  if (!top || !top.payload?.category) {
    return [];
  }

  return result.map((r) => ({
    category: r.payload?.category as Category,
    score: r.score,
  }));
}

export async function classifyAndStoreTweet(tweetId: number, text: string) {
  const vector = await embed(text);

  const labels = await chooseCategoriesFromCentroids(vector);

  await qdrant.upsert(TWEET_COLLECTION, {
    wait: true,
    points: [
      {
        id: tweetId,
        vector,
        payload: {
          kind: "tweet",
          tweet_id: tweetId,
          text,
          predicted_categories: labels.map((l) => l.category).join(","),
          category_scores: labels.map((l) => l.score).join(","),
          classified_at: new Date().toISOString(),
        },
      },
    ],
  });

  return labels;
}
