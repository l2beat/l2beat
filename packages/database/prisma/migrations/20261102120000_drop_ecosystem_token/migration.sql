-- The ecosystems page was removed, and with it the indexer that filled this
-- table with governance-token prices for the ecosystem token widget.
DROP TABLE "EcosystemToken";

-- State of the removed indexer. Left in place, a re-added indexer with the
-- same name would resume from it.
DELETE FROM "IndexerConfiguration" WHERE "indexerId" = 'ecosystem_token_indexer';
DELETE FROM "IndexerState" WHERE "indexerId" = 'ecosystem_token_indexer';
