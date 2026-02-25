-- AlterTable
ALTER TABLE "AggregatedInteropToken" ADD COLUMN     "burnedValueUsd" REAL,
ADD COLUMN     "mintedValueUsd" REAL;

-- AlterTable
ALTER TABLE "AggregatedInteropTransfer" ADD COLUMN     "burnedValueUsd" REAL,
ADD COLUMN     "mintedValueUsd" REAL;
