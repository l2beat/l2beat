import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/core/Drawer'
import { InfoIcon } from '~/icons/Info'

export function EigenDataSourceInfo() {
  return (
    <>
      <div className="font-medium text-2xs text-secondary max-sm:hidden">
        Data source: API provided by EigenLayer. Please note that the maximum
        throughput claimed of 100 MiB/s has not been verified by L2BEAT.
      </div>
      <Drawer>
        <DrawerTrigger className="flex items-center gap-1 font-medium text-[13px] text-secondary sm:hidden">
          Data source
          <InfoIcon className="size-4" />
        </DrawerTrigger>
        <DrawerContent className="px-1 pb-8">
          <DrawerHeader>
            <DrawerTitle className="font-semibold text-[18px] text-primary">
              Data source
            </DrawerTitle>
            <DrawerDescription className="font-normal text-primary">
              API provided by EigenLayer
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </>
  )
}
