-- AlterTable
ALTER TABLE "AggregatedInteropToken" ADD COLUMN     "durationCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "AggregatedInteropTransfer" ADD COLUMN     "durationCount" INTEGER NOT NULL DEFAULT 0;
