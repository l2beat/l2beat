-- AlterTable
ALTER TABLE "DeployedToken" ADD COLUMN     "ignored" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "DeployedToken_ignored_idx" ON "DeployedToken"("ignored");
