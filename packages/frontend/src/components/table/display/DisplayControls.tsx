import { Checkbox } from '~/components/core/Checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/core/Popover'
import { SlidersIcon } from '~/icons/Sliders'
import {
  type DisplayControlsKey,
  useDisplayControlsContext,
} from './DisplayControlsContext'
import { DISPLAY_OPTIONS } from './displayOptions'

export function DisplayControls() {
  const { displayState, setDisplay } = useDisplayControlsContext()

  const providedEntries = Object.entries(displayState).filter(
    ([_, value]) => value !== undefined,
  ) as [DisplayControlsKey, boolean][]

  const checkedEntries = providedEntries.filter(([_, value]) => value).length

  const trigger = (
    <div className="mb-1 flex h-8 w-fit items-center gap-1.5 rounded-lg bg-surface-primary p-2 font-semibold text-base">
      <SlidersIcon className="size-4 fill-secondary" />
      <span className="text-label-value-14 md:text-label-value-15">
        Display
      </span>
      {checkedEntries > 0 && (
        <div className="rounded-full bg-brand px-1.5 py-[3px] font-semibold text-2xs text-primary-invert leading-none">
          {checkedEntries}
        </div>
      )}
    </div>
  )

  return (
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
          <Checkbox
            key={key}
            name={key}
            checked={value}
            onCheckedChange={(checked) => setDisplay(key, !!checked)}
            className="w-full rounded-sm hover:bg-surface-primary-hover"
          >
            {DISPLAY_OPTIONS[key]}
          </Checkbox>
        ))}
      </PopoverContent>
    </Popover>
  )
}
