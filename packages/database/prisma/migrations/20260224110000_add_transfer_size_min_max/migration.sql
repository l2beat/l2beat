ALTER TABLE "AggregatedInteropTransfer"
ADD COLUMN "minTransferValueUsd" REAL,
ADD COLUMN "maxTransferValueUsd" REAL;

ALTER TABLE "AggregatedInteropToken"
ADD COLUMN "minTransferValueUsd" REAL,
ADD COLUMN "maxTransferValueUsd" REAL;
