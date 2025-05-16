DROP TABLE "AggregatedLiveness";

ALTER TABLE "AggregatedLiveness2" RENAME TO "AggregatedLiveness";

ALTER TABLE "AggregatedLiveness" RENAME CONSTRAINT "AggregatedLiveness2_pkey" TO "AggregatedLiveness_pkey";