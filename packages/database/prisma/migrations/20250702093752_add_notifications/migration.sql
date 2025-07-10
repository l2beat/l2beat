-- CreateTable
CREATE TABLE "Notification" (
    "id" VARCHAR(255) NOT NULL,
    "channel" VARCHAR(255) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "relatedEntityId" VARCHAR(255) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
