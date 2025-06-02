-- CreateTable
CREATE TABLE "DataAvailability2" (
    "timestamp" TIMESTAMP(6) NOT NULL,
    "daLayer" VARCHAR(255) NOT NULL,
    "projectId" VARCHAR(255) NOT NULL,
    "configurationId" VARCHAR(12) NOT NULL,
    "totalSize" BIGINT NOT NULL,

    CONSTRAINT "DataAvailability2_pkey" PRIMARY KEY ("timestamp","daLayer","projectId","configurationId")
);
