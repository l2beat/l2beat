-- CreateTable
CREATE TABLE "ActivityHeadBlock" (
    "projectId" VARCHAR(255) NOT NULL,
    "number" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "count" INTEGER NOT NULL,
    "uopsCount" INTEGER,

    CONSTRAINT "ActivityHeadBlock_pkey" PRIMARY KEY ("projectId","number")
);
