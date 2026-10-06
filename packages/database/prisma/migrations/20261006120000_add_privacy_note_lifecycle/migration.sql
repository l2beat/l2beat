-- AlterTable
ALTER TABLE "PrivacyAnonymitySetEvent"
    ALTER COLUMN "sender" DROP NOT NULL,
    ADD COLUMN "noteId" BIGINT,
    ADD COLUMN "active" BOOLEAN,
    ADD COLUMN "expiresAt" TIMESTAMP(6);
