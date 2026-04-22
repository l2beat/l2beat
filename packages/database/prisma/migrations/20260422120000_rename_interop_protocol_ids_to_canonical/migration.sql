WITH "id_mapping"("oldId", "newId") AS (
  VALUES
    ('abstract', 'abstract-canonical'),
    ('agglayer', 'agglayer-canonical'),
    ('arbitrum', 'arbitrum-canonical'),
    ('avalanche', 'avalanche-canonical'),
    ('base', 'base-canonical'),
    ('celo', 'celo-canonical'),
    ('ink', 'ink-canonical'),
    ('linea', 'linea-canonical'),
    ('optimism', 'op-mainnet-canonical'),
    ('polygon-pos', 'polygon-pos-canonical'),
    ('zksync2', 'zksync2-canonical')
)
INSERT INTO "AggregatedInteropTransfer" (
  "timestamp",
  "id",
  "bridgeType",
  "srcChain",
  "dstChain",
  "transferTypeStats",
  "transferCount",
  "transfersWithDurationCount",
  "identifiedCount",
  "totalDurationSum",
  "srcValueUsd",
  "dstValueUsd",
  "minTransferValueUsd",
  "maxTransferValueUsd",
  "avgValueInFlight",
  "mintedValueUsd",
  "burnedValueUsd",
  "countUnder100",
  "count100To1K",
  "count1KTo10K",
  "count10KTo100K",
  "countOver100K"
)
SELECT
  t."timestamp",
  m."newId",
  t."bridgeType",
  t."srcChain",
  t."dstChain",
  t."transferTypeStats",
  t."transferCount",
  t."transfersWithDurationCount",
  t."identifiedCount",
  t."totalDurationSum",
  t."srcValueUsd",
  t."dstValueUsd",
  t."minTransferValueUsd",
  t."maxTransferValueUsd",
  t."avgValueInFlight",
  t."mintedValueUsd",
  t."burnedValueUsd",
  t."countUnder100",
  t."count100To1K",
  t."count1KTo10K",
  t."count10KTo100K",
  t."countOver100K"
FROM "AggregatedInteropTransfer" t
JOIN "id_mapping" m ON t."id" = m."oldId"
ON CONFLICT ("timestamp", "srcChain", "dstChain", "bridgeType", "id") DO NOTHING;

WITH "id_mapping"("oldId", "newId") AS (
  VALUES
    ('abstract', 'abstract-canonical'),
    ('agglayer', 'agglayer-canonical'),
    ('arbitrum', 'arbitrum-canonical'),
    ('avalanche', 'avalanche-canonical'),
    ('base', 'base-canonical'),
    ('celo', 'celo-canonical'),
    ('ink', 'ink-canonical'),
    ('linea', 'linea-canonical'),
    ('optimism', 'op-mainnet-canonical'),
    ('polygon-pos', 'polygon-pos-canonical'),
    ('zksync2', 'zksync2-canonical')
)
DELETE FROM "AggregatedInteropTransfer" t
USING "id_mapping" m
WHERE t."id" = m."oldId";

WITH "id_mapping"("oldId", "newId") AS (
  VALUES
    ('abstract', 'abstract-canonical'),
    ('agglayer', 'agglayer-canonical'),
    ('arbitrum', 'arbitrum-canonical'),
    ('avalanche', 'avalanche-canonical'),
    ('base', 'base-canonical'),
    ('celo', 'celo-canonical'),
    ('ink', 'ink-canonical'),
    ('linea', 'linea-canonical'),
    ('optimism', 'op-mainnet-canonical'),
    ('polygon-pos', 'polygon-pos-canonical'),
    ('zksync2', 'zksync2-canonical')
)
INSERT INTO "AggregatedInteropToken" (
  "timestamp",
  "id",
  "srcChain",
  "dstChain",
  "bridgeType",
  "abstractTokenId",
  "transferTypeStats",
  "mintedValueUsd",
  "burnedValueUsd",
  "transferCount",
  "transfersWithDurationCount",
  "totalDurationSum",
  "volume",
  "minTransferValueUsd",
  "maxTransferValueUsd"
)
SELECT
  t."timestamp",
  m."newId",
  t."srcChain",
  t."dstChain",
  t."bridgeType",
  t."abstractTokenId",
  t."transferTypeStats",
  t."mintedValueUsd",
  t."burnedValueUsd",
  t."transferCount",
  t."transfersWithDurationCount",
  t."totalDurationSum",
  t."volume",
  t."minTransferValueUsd",
  t."maxTransferValueUsd"
FROM "AggregatedInteropToken" t
JOIN "id_mapping" m ON t."id" = m."oldId"
ON CONFLICT ("timestamp", "srcChain", "dstChain", "bridgeType", "id", "abstractTokenId") DO NOTHING;

WITH "id_mapping"("oldId", "newId") AS (
  VALUES
    ('abstract', 'abstract-canonical'),
    ('agglayer', 'agglayer-canonical'),
    ('arbitrum', 'arbitrum-canonical'),
    ('avalanche', 'avalanche-canonical'),
    ('base', 'base-canonical'),
    ('celo', 'celo-canonical'),
    ('ink', 'ink-canonical'),
    ('linea', 'linea-canonical'),
    ('optimism', 'op-mainnet-canonical'),
    ('polygon-pos', 'polygon-pos-canonical'),
    ('zksync2', 'zksync2-canonical')
)
DELETE FROM "AggregatedInteropToken" t
USING "id_mapping" m
WHERE t."id" = m."oldId";

WITH "id_mapping"("oldId", "newId") AS (
  VALUES
    ('abstract', 'abstract-canonical'),
    ('agglayer', 'agglayer-canonical'),
    ('arbitrum', 'arbitrum-canonical'),
    ('avalanche', 'avalanche-canonical'),
    ('base', 'base-canonical'),
    ('celo', 'celo-canonical'),
    ('ink', 'ink-canonical'),
    ('linea', 'linea-canonical'),
    ('optimism', 'op-mainnet-canonical'),
    ('polygon-pos', 'polygon-pos-canonical'),
    ('zksync2', 'zksync2-canonical')
)
INSERT INTO "AggregatedInteropTokensPair" (
  "timestamp",
  "id",
  "srcChain",
  "dstChain",
  "bridgeType",
  "tokenA",
  "tokenB",
  "transferTypeStats",
  "transferCount",
  "transfersWithDurationCount",
  "totalDurationSum",
  "volume",
  "minTransferValueUsd",
  "maxTransferValueUsd"
)
SELECT
  t."timestamp",
  m."newId",
  t."srcChain",
  t."dstChain",
  t."bridgeType",
  t."tokenA",
  t."tokenB",
  t."transferTypeStats",
  t."transferCount",
  t."transfersWithDurationCount",
  t."totalDurationSum",
  t."volume",
  t."minTransferValueUsd",
  t."maxTransferValueUsd"
FROM "AggregatedInteropTokensPair" t
JOIN "id_mapping" m ON t."id" = m."oldId"
ON CONFLICT ("timestamp", "srcChain", "dstChain", "bridgeType", "id", "tokenA", "tokenB") DO NOTHING;

WITH "id_mapping"("oldId", "newId") AS (
  VALUES
    ('abstract', 'abstract-canonical'),
    ('agglayer', 'agglayer-canonical'),
    ('arbitrum', 'arbitrum-canonical'),
    ('avalanche', 'avalanche-canonical'),
    ('base', 'base-canonical'),
    ('celo', 'celo-canonical'),
    ('ink', 'ink-canonical'),
    ('linea', 'linea-canonical'),
    ('optimism', 'op-mainnet-canonical'),
    ('polygon-pos', 'polygon-pos-canonical'),
    ('zksync2', 'zksync2-canonical')
)
DELETE FROM "AggregatedInteropTokensPair" t
USING "id_mapping" m
WHERE t."id" = m."oldId";
