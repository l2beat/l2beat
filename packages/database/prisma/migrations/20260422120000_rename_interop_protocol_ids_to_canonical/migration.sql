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
UPDATE "AggregatedInteropTransfer" t
SET "id" = m."newId"
FROM "id_mapping" m
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
UPDATE "AggregatedInteropToken" t
SET "id" = m."newId"
FROM "id_mapping" m
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
UPDATE "AggregatedInteropTokensPair" t
SET "id" = m."newId"
FROM "id_mapping" m
WHERE t."id" = m."oldId";
