-- CreateTable
CREATE TABLE "LiveCheck" (
    "feature" VARCHAR(64) NOT NULL,
    "chain" VARCHAR(64) NOT NULL,
    "from" TIMESTAMP(6) NOT NULL,
    "to" TIMESTAMP(6) NOT NULL,
    "status" VARCHAR(16) NOT NULL,
    "compared" INTEGER NOT NULL,
    "missing" INTEGER NOT NULL,
    "extra" INTEGER NOT NULL,
    "changed" INTEGER NOT NULL,
    "checkedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "LiveCheck_pkey" PRIMARY KEY ("feature","chain","from","to")
);

-- CreateIndex
CREATE INDEX "LiveCheck_feature_status_idx" ON "LiveCheck"("feature", "status");
