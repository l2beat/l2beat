import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/core/Drawer'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/core/Popover'
import { SlidersIcon } from '~/icons/Sliders'
import { cn } from '~/utils/cn'
import { DisplayOptionCheckbox } from './DisplayOptionCheckbox'
import type { DisplayOptionsKey } from './displayOptions'

interface Props<K extends DisplayOptionsKey> {
  display: Record<K, boolean>
  setDisplay: (key: K, value: boolean) => void
}
export function DisplayControls<K extends DisplayOptionsKey>({
  display,
  setDisplay,
}: Props<K>) {
  const providedEntries = Object.entries(display) as [K, boolean][]

  const checkedCount = providedEntries.filter(([_, value]) => value).length

  const trigger = (
    <div className="flex h-8 w-fit items-center gap-1.5 rounded-lg bg-surface-primary! p-2 font-semibold text-base">
      <SlidersIcon className="size-4 fill-secondary" />
      <span className="text-label-value-14 md:text-label-value-15">
        Display
      </span>
      <div
        className={cn(
          'rounded-full bg-brand font-semibold text-2xs text-primary-invert leading-none transition-all',
          checkedCount === 0
            ? '-mr-3 scale-0 opacity-0'
            : 'size-fit px-1.5 py-[3px]',
        )}
      >
        {checkedCount}
      </div>
    </div>
  )

  return (
    <>
      <Popover>
        <PopoverTrigger className="max-md:hidden" asChild>
          {trigger}
        </PopoverTrigger>
        <PopoverContent
          className="!bg-surface-primary max-w-fit p-2"
          align="end"
          side="bottom"
        >
          {providedEntries.map(([key, value]) => (
            <DisplayOptionCheckbox
              key={key}
              optionKey={key}
              checked={value}
              onCheckedChange={(checked) => setDisplay(key, checked)}
              className="w-full hover:bg-surface-primary-hover max-md:pl-0"
            />
          ))}
        </PopoverContent>
      </Popover>
      <Drawer>
        <DrawerTrigger className="bg-surface-secondary md:hidden" asChild>
          {trigger}
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="mb-3 gap-0">
            <DrawerTitle className="mb-0 text-lg text-primary">
              Display
            </DrawerTitle>
            <DrawerDescription className="sr-only font-semibold text-secondary text-xs">
              Select options to display.
            </DrawerDescription>
          </DrawerHeader>
          <div className="mb-5 flex flex-wrap gap-1">
            {providedEntries.map(([key, value]) => (
              <DisplayOptionCheckbox
                key={key}
                optionKey={key}
                checked={value}
                onCheckedChange={(checked) => setDisplay(key, checked)}
                className="w-full hover:bg-surface-primary-hover max-md:pl-0"
              />
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
