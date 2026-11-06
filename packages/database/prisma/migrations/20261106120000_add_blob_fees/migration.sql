-- AlterTable
ALTER TABLE "DataAvailability" ADD COLUMN "totalFeeEth" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "LiveBlock" ADD COLUMN "blobBaseFee" BIGINT;

-- CreateTable
CREATE TABLE "BlobFee" (
    "blockNumber" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "blobBaseFee" BIGINT NOT NULL,
    "baseFeePerGas" BIGINT NOT NULL,

    CONSTRAINT "BlobFee_pkey" PRIMARY KEY ("blockNumber")
);

-- CreateTable
CREATE TABLE "BlobFeeHourly" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "blocks" INTEGER NOT NULL,
    "avgBlobBaseFee" BIGINT NOT NULL,
    "maxBlobBaseFee" BIGINT NOT NULL,
    "avgBaseFeePerGas" BIGINT NOT NULL,

    CONSTRAINT "BlobFeeHourly_pkey" PRIMARY KEY ("timestamp")
);

-- CreateIndex
CREATE INDEX "BlobFee_timestamp_idx" ON "BlobFee"("timestamp");
