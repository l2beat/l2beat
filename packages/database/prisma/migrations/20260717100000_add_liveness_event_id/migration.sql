-- AlterTable
ALTER TABLE "Liveness" ADD COLUMN "eventId" VARCHAR(255);
UPDATE "Liveness" SET "eventId" = "txHash";
ALTER TABLE "Liveness" ALTER COLUMN "eventId" SET NOT NULL;
ALTER TABLE "Liveness" DROP CONSTRAINT "Liveness_pkey";
ALTER TABLE "Liveness" ADD CONSTRAINT "Liveness_pkey" PRIMARY KEY ("configurationId", "eventId");

-- AlterTable
ALTER TABLE "RealTimeLiveness" ADD COLUMN "eventId" VARCHAR(255);
UPDATE "RealTimeLiveness" SET "eventId" = "txHash";
ALTER TABLE "RealTimeLiveness" ALTER COLUMN "eventId" SET NOT NULL;
ALTER TABLE "RealTimeLiveness" DROP CONSTRAINT "RealTimeLiveness_pkey";
ALTER TABLE "RealTimeLiveness" ADD CONSTRAINT "RealTimeLiveness_pkey" PRIMARY KEY ("configurationId", "eventId");
