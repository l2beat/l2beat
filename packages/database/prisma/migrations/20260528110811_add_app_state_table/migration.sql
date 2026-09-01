-- CreateTable
CREATE TABLE "AppState" (
    "key" VARCHAR(255) NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(6) NOT NULL,
    "updatedBy" VARCHAR(255) NOT NULL,

    CONSTRAINT "AppState_pkey" PRIMARY KEY ("key")
);
