ALTER TABLE "AggregatedInteropTransfer"
ADD COLUMN "transferTypeStats" JSONB;

ALTER TABLE "AggregatedInteropToken"
ADD COLUMN "transferTypeStats" JSONB;
