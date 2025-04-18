import { InfoIcon } from '~/icons/info'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './core/drawer'

export function TabInfoWithDrawer({
  title,
  content,
}: { title: string; content: string }) {
  return (
    <div className="mb-3 flex flex-row sm:mb-3">
      <div className="text-[11px] !leading-[15px] md:text-[13px]">
        <p className="text-secondary max-sm:hidden">{content}</p>
        <Drawer>
          <DrawerTrigger className="flex items-center gap-1 sm:hidden">
            <InfoIcon className="size-3 fill-blue-550" />
            <div className="text-2xs font-medium text-secondary underline">
              {title}
            </div>
          </DrawerTrigger>
          <DrawerContent className="px-1 pb-8">
            <DrawerHeader>
              <DrawerTitle className="text-[18px] font-semibold text-primary">
                {title}
              </DrawerTitle>
              <DrawerDescription className="font-normal text-primary">
                {content}
              </DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  )
}
