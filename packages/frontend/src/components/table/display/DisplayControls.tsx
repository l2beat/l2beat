import { Checkbox } from '~/components/core/Checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/core/Popover'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { InfoIcon } from '~/icons/Info'
import { SlidersIcon } from '~/icons/Sliders'
import { useDisplayControlsContext } from './DisplayControlsContext'
import {
  DISPLAY_OPTIONS,
  type DisplayOption,
  type DisplayOptionsKey,
} from './displayOptions'

export function DisplayControls() {
  const { displayState, setDisplay } = useDisplayControlsContext()

  const providedEntries = Object.entries(displayState).filter(
    ([_, value]) => value !== undefined,
  ) as [DisplayOptionsKey, boolean][]

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
        {providedEntries.map(([key, value]) => {
          const option: DisplayOption = DISPLAY_OPTIONS[key]
          return (
            <Checkbox
              key={key}
              name={key}
              checked={value}
              onCheckedChange={(checked) => setDisplay(key, !!checked)}
              className="w-full rounded-sm hover:bg-surface-primary-hover"
            >
              <div className="flex items-center gap-1">
                {option.label}
                {option.tooltip && (
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="size-3.5" />
                    </TooltipTrigger>
                    <TooltipContent>{option.tooltip}</TooltipContent>
                  </Tooltip>
                )}
              </div>
            </Checkbox>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}

{
  /* <Tooltip>
<Checkbox
  name="includeRwaRestrictedTokens"
  checked={includeRwaRestrictedTokens}
  onCheckedChange={(checked) => setIncludeRwaRestrictedTokens(!!checked)}
>
  <div className="flex items-center gap-1">
    <div>Include restricted RWA tokens</div>
    <TooltipTrigger asChild>
      <div className="flex size-4 items-center justify-center">
        <InfoIcon className="size-3.5" />
      </div>
    </TooltipTrigger>
  </div>
</Checkbox>
<TooltipContent>
  Centralized RWAs with access, transfer, transparency or onchain
  liquidity restrictions. A more formal framework for RWAs is in the
  works!
</TooltipContent>
</Tooltip> */
}
