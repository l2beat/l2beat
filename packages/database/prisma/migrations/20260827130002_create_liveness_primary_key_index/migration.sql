-- Keep this as a single statement so PostgreSQL can build the replacement
-- primary-key index concurrently, outside an implicit multi-statement
-- transaction.
CREATE UNIQUE INDEX CONCURRENTLY "Liveness_new_pkey"
ON "Liveness"("configurationId", "txHash", "groupingKey");
