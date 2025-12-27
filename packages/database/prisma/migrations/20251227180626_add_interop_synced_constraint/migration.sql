-- AddForeignKey
ALTER TABLE "InteropPluginSyncedRange" ADD CONSTRAINT "InteropPluginSyncedRange_pluginName_fkey" FOREIGN KEY ("pluginName") REFERENCES "InteropPluginStatus"("pluginName") ON DELETE CASCADE ON UPDATE CASCADE;
