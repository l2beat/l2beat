-- Keep this as a single statement so PostgreSQL can build the index
-- concurrently, outside an implicit multi-statement transaction.
CREATE UNIQUE INDEX CONCURRENTLY "Liveness_configurationId_groupingKey_key"
ON "Liveness"("configurationId", "groupingKey")
WHERE "groupingKey" IS NOT NULL;
