-- RenameTable
ALTER TABLE "TvsPrice" RENAME TO "TokenPrice";

-- RenameIndex
ALTER INDEX "TvsPrice_priceId_idx" RENAME TO "TokenPrice_priceId_idx";

-- RenameConstraint
ALTER TABLE "TokenPrice" RENAME CONSTRAINT "TvsPrice_pkey" TO "TokenPrice_pkey";

-- UpdateIndexerState
UPDATE "IndexerState" SET "indexerId" = 'token_price_indexer' WHERE "indexerId" = 'tvs_price_indexer';

-- UpdateIndexerConfiguration
UPDATE "IndexerConfiguration" SET "indexerId" = 'token_price_indexer' WHERE "indexerId" = 'tvs_price_indexer';
