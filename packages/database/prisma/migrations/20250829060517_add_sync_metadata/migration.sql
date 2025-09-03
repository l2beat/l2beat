-- CreateTable
CREATE TABLE "SyncMetadata" (
    "feature" VARCHAR(255) NOT NULL,
    "id" VARCHAR(255) NOT NULL,
    "target" TIMESTAMP(6) NOT NULL,
    "syncedUntil" TIMESTAMP(6),
    "blockTarget" INTEGER,
    "blockSyncedUntil" INTEGER,

    CONSTRAINT "SyncMetadata_pkey" PRIMARY KEY ("feature","id")
);

-- CreateIndex
CREATE INDEX "SyncMetadata_feature_id_idx" ON "SyncMetadata"("feature", "id");
