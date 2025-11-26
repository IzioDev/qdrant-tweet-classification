# Install

* run qdrant (this will create the storage folder in the current directory):
```bash
docker run -p 6333:6333 -p 6334:6334 \
    -v "$(pwd)/qdrant_storage:/qdrant/storage:z" \
    qdrant/qdrant
```

* copy `.env`:
```bash
cp .env.dist .env
```

* add your OPEN_AI api key in .env

* install nodejs dependencies:
```bash
npm i
```

* start the service:
```bash
npm run start
```

* open qdrant ui: http://localhost:6333/dashboard#/collections/tweets_semantic

* start classify elements:
```bash
curl -X POST http://localhost:8080/classify \
  -H "Content-Type: application/json" \
  -d '{
    "id": "184732947283",
    "text": "Kaspa vProgs bring verifiable off-chain computation with on-chain proofs. PoW smart contracts without bloat."
  }'
```

Example Output:
```
curl -X POST http://localhost:8080/classify \
  -H "Content-Type: application/json" \
  -d '{
    "id": "184732947283",
    "text": "Kaspa vProgs, or Verifiable Programs, represent a foundational protocol upgrade for the Kaspa blockchain, a high-throughput proof-of-work (PoW) network utilizing a blockDAG (Directed Acyclic Graph) structure rather than a traditional linear chain. Introduced in mid-2025 through a draft yellow paper by core developer Michael Sutton, vProgs aim to enable native programmability on Kaspa’s Layer 1 (L1) without compromising its core strengths in speed, security, and decentralization. This framework addresses longstanding limitations in blockchain scalability by decoupling computation from on-chain execution, allowing for complex, verifiable applications while preserving the network’s lightweight consensus mechanism."
  }'
[{"category":"vprog","score":0.84219134}]
```
The result is stored on Qdrant

## Change categories (refine labelling)
* modify categories in `category.ts` and add / edit / remove the examples (examples are used to label future classification, this is our source of truth)

When you'll re-initialize the classification, it'll remove the old one and insert new ones if it detects a miss-match

## Visualizing Clusters (similar data point)

On the UI > Collection > Visualize, and press ctrl + ENTER in the right pane

[image](./qdrant_cluster.png)
