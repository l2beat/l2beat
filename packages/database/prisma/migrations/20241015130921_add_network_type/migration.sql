-- CreateEnum
CREATE TYPE "NetworkType" AS ENUM ('EVM');

-- AlterTable
ALTER TABLE "Network" ADD COLUMN     "type" "NetworkType" NOT NULL DEFAULT 'EVM',
ALTER COLUMN "chainId" DROP NOT NULL;
