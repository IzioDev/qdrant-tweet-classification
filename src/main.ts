import "dotenv/config";
import { syncCategories } from "./category";
import { ensureCollection } from "./setup-collection";
import express from "express";
import { classifyAndStoreTweet } from "./classify";

const boot = async () => {
  console.log("Starting service.");
  console.log("Ensuring qdrant collection exists...");

  await ensureCollection();

  console.log("Collection ensured to exists.");
  console.log("Ensuring category seeds are populated...");

  await syncCategories();

  const app = express();
  app.use(express.json());

  app.post("/classify", async (req, res) => {
    try {
      const { id, text } = req.body as { id?: string; text?: string };

      if (!text) {
        return res.status(400).json({ error: "`text` is required" });
      }

      const response = await classifyAndStoreTweet(
        Number(id) ?? Date.now(),
        text,
      );

      res.json(response);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({
        error: "classification_failed",
        message: err?.message ?? String(err),
      });
    }
  });

  app.listen(8080, () => {
    console.log(`Classifier API listening on http://localhost:8080`);
  });
};

boot().catch(console.error);
