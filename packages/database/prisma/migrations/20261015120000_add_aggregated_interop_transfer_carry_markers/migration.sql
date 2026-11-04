-- AlterTable
ALTER TABLE "AggregatedInteropTransfer" ADD COLUMN "carriedFrom" TIMESTAMP(6),
ADD COLUMN "isPartial" BOOLEAN NOT NULL DEFAULT false;
