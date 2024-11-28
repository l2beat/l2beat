/*
  Warnings:

  - You are about to drop the column `managedBy` on the `ExternalBridge` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExternalBridge" DROP COLUMN "managedBy";

-- CreateTable
CREATE TABLE "Entity" (
    "id" CHAR(21) NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EntityToExternalBridge" (
    "A" CHAR(21) NOT NULL,
    "B" CHAR(21) NOT NULL
);

-- CreateTable
CREATE TABLE "_EntityToToken" (
    "A" CHAR(21) NOT NULL,
    "B" CHAR(21) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EntityToExternalBridge_AB_unique" ON "_EntityToExternalBridge"("A", "B");

-- CreateIndex
CREATE INDEX "_EntityToExternalBridge_B_index" ON "_EntityToExternalBridge"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EntityToToken_AB_unique" ON "_EntityToToken"("A", "B");

-- CreateIndex
CREATE INDEX "_EntityToToken_B_index" ON "_EntityToToken"("B");

-- AddForeignKey
ALTER TABLE "_EntityToExternalBridge" ADD CONSTRAINT "_EntityToExternalBridge_A_fkey" FOREIGN KEY ("A") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EntityToExternalBridge" ADD CONSTRAINT "_EntityToExternalBridge_B_fkey" FOREIGN KEY ("B") REFERENCES "ExternalBridge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EntityToToken" ADD CONSTRAINT "_EntityToToken_A_fkey" FOREIGN KEY ("A") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EntityToToken" ADD CONSTRAINT "_EntityToToken_B_fkey" FOREIGN KEY ("B") REFERENCES "Token"("id") ON DELETE CASCADE ON UPDATE CASCADE;
