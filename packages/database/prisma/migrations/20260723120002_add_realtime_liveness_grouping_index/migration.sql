-- Keep this as a single statement so PostgreSQL can build the index
-- concurrently, outside an implicit multi-statement transaction.
CREATE UNIQUE INDEX CONCURRENTLY "RealTimeLiveness_configurationId_groupingKey_key"
ON "RealTimeLiveness"("configurationId", "groupingKey")
WHERE "groupingKey" IS NOT NULL;
