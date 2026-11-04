-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "peakHourCount" INTEGER,
ADD COLUMN     "peakHourUopsCount" INTEGER,
ADD COLUMN     "peakMinuteCount" INTEGER,
ADD COLUMN     "peakMinuteUopsCount" INTEGER;

-- AlterTable
ALTER TABLE "HourlyActivity" ALTER COLUMN "peakCount" DROP NOT NULL;
