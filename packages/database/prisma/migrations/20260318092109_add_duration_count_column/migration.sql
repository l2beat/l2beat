-- AlterTable
ALTER TABLE "AggregatedInteropToken" ADD COLUMN     "transfersWithDurationCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "AggregatedInteropTransfer" ADD COLUMN     "transfersWithDurationCount" INTEGER NOT NULL DEFAULT 0;
