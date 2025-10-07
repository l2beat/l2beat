-- AlterTable
ALTER TABLE "BridgeEvent" ADD COLUMN     "plugin" VARCHAR(64) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "BridgeMessage" ADD COLUMN     "plugin" VARCHAR(64) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "BridgeTransfer" ADD COLUMN     "plugin" VARCHAR(64) NOT NULL DEFAULT '';
