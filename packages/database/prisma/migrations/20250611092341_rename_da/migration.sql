ALTER TABLE "DataAvailability2" RENAME TO "DataAvailability";

ALTER TABLE "DataAvailability"
RENAME CONSTRAINT "DataAvailability2_pkey" TO "DataAvailability_pkey";

ALTER INDEX "DataAvailability2_projectId_timestamp_idx"
RENAME TO "DataAvailability_projectId_timestamp_idx";