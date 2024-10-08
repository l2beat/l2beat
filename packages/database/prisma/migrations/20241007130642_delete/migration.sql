/*
  Warnings:

  - You are about to drop the column `version` on the `UpdateMonitor` table. All the data in the column will be lost.
  - You are about to drop the `DailyDiscovery` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "UpdateMonitor" DROP COLUMN "version";

-- DropTable
DROP TABLE "DailyDiscovery";
