-- CreateTable
CREATE TABLE "TokenDenylist" (
    "chain" VARCHAR(32) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenDenylist_pkey" PRIMARY KEY ("chain","address")
);
