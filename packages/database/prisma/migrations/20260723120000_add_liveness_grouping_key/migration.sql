-- AlterTable
ALTER TABLE "Liveness" ADD COLUMN "groupingKey" VARCHAR(255);

-- AlterTable
ALTER TABLE "RealTimeLiveness" ADD COLUMN "groupingKey" VARCHAR(255);
