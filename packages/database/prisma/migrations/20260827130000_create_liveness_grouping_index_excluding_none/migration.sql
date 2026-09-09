-- Keep this as a single statement so PostgreSQL can build the index
-- concurrently, outside an implicit multi-statement transaction.
-- Replaces the IS NOT NULL grouping index: ungrouped records are about to
-- receive the 'none' sentinel and must stay out of the unique grouping
-- constraint.
CREATE UNIQUE INDEX CONCURRENTLY "Liveness_configurationId_groupingKey_idx"
ON "Liveness"("configurationId", "groupingKey")
WHERE "groupingKey" != 'none';
