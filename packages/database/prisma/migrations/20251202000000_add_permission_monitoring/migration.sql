-- AlterTable
ALTER TABLE "UpdateDiff" ADD COLUMN "details" JSONB;

-- CreateTable
CREATE TABLE "PermissionResolution" (
    "id" SERIAL NOT NULL,
    "projectId" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "resolutionBlob" JSONB NOT NULL,

    CONSTRAINT "PermissionResolution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PermissionResolution_projectId_timestamp_idx" ON "PermissionResolution"("projectId", "timestamp");

-- CreateIndex
CREATE INDEX "PermissionResolution_timestamp_idx" ON "PermissionResolution"("timestamp");