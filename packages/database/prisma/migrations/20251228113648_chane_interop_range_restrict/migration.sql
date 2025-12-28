-- DropForeignKey
ALTER TABLE "InteropPluginSyncedRange" DROP CONSTRAINT "InteropPluginSyncedRange_pluginName_fkey";

-- AddForeignKey
ALTER TABLE "InteropPluginSyncedRange" ADD CONSTRAINT "InteropPluginSyncedRange_pluginName_fkey" FOREIGN KEY ("pluginName") REFERENCES "InteropPluginStatus"("pluginName") ON DELETE RESTRICT ON UPDATE CASCADE;
