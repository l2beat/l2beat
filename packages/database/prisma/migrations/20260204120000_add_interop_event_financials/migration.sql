-- AlterTable
ALTER TABLE "InteropEvent" ADD COLUMN     "abstractTokenId" VARCHAR(66),
ADD COLUMN     "symbol" VARCHAR(66),
ADD COLUMN     "amount" REAL,
ADD COLUMN     "price" REAL,
ADD COLUMN     "valueUsd" REAL,
ADD COLUMN     "isProcessed" BOOLEAN NOT NULL DEFAULT false;
