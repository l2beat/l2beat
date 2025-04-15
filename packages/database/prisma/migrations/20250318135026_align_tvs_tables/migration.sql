/*
  Warnings:

  - The primary key for the `TvsBlockTimestamp` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TvsPrice` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "TvsBlockTimestamp" DROP CONSTRAINT "TvsBlockTimestamp_pkey",
ADD CONSTRAINT "TvsBlockTimestamp_pkey" PRIMARY KEY ("timestamp", "configurationId");

-- AlterTable
ALTER TABLE "TvsPrice" DROP CONSTRAINT "TvsPrice_pkey",
ADD CONSTRAINT "TvsPrice_pkey" PRIMARY KEY ("timestamp", "configurationId");

-- CreateIndex
CREATE INDEX "TvsBlockTimestamp_chain_idx" ON "TvsBlockTimestamp"("chain");
