import { InfoIcon } from '~/icons/Info'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './core/Drawer'

export function TabInfoWithDrawer({
  title,
  content,
}: {
  title: string
  content: string
}) {
  return (
    <div className="mb-3 flex flex-row sm:mb-3">
      <div className="text-label-value-13 leading-4.5">
        <p className="text-secondary max-sm:hidden">{content}</p>
        <Drawer>
          <DrawerTrigger className="flex items-center gap-1 sm:hidden">
            <InfoIcon className="size-3 fill-current text-secondary" />
            <div className="font-medium text-label-value-13 text-secondary underline decoration-divider underline-offset-[0.3em]">
              {title}
            </div>
          </DrawerTrigger>
          <DrawerContent className="px-1 pb-8">
            <DrawerHeader>
              <DrawerTitle className="font-semibold text-heading-20 text-primary leading-6 tracking-[-0.01em]">
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
