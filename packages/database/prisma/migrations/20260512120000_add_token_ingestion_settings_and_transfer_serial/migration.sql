ALTER TABLE "InteropTransfer" ADD COLUMN "serialId" BIGSERIAL NOT NULL;

CREATE UNIQUE INDEX "InteropTransfer_serialId_key" ON "InteropTransfer"("serialId");

CREATE TABLE "TokenDbSetting" (
    "key" VARCHAR(255) NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "TokenDbSetting_pkey" PRIMARY KEY ("key")
);
