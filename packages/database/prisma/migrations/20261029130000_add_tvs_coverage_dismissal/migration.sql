-- CreateTable
CREATE TABLE "TvsCoverageDismissal" (
    "projectId" VARCHAR(255) NOT NULL,
    "chain" VARCHAR(32) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "reason" VARCHAR(32) NOT NULL,
    "comment" TEXT,
    "dismissedBy" VARCHAR(255) NOT NULL,
    "dismissedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "TvsCoverageDismissal_pkey" PRIMARY KEY ("projectId","chain","address")
);
