import { Checkbox } from '~/components/core/Checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { InfoIcon } from '~/icons/Info'
import { cn } from '~/utils/cn'
import {
  DISPLAY_OPTIONS,
  type DisplayOption,
  type DisplayOptionsKey,
} from './displayOptions'

interface Props {
  optionKey: DisplayOptionsKey
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  /** When set, the checkbox is disabled and this replaces the option tooltip. */
  disabledReason?: string
  name?: string
  className?: string
}

/** A checkbox for one of the shared `DISPLAY_OPTIONS`, with its label and info tooltip. */
export function DisplayOptionCheckbox({
  optionKey,
  checked,
  onCheckedChange,
  disabledReason,
  name = optionKey,
  className,
}: Props) {
  const option: DisplayOption = DISPLAY_OPTIONS[optionKey]
  const tooltip = disabledReason ?? option.tooltip
  return (
    <Checkbox
      name={name}
      checked={checked}
      disabled={disabledReason !== undefined}
      onCheckedChange={(checked) => onCheckedChange(!!checked)}
      className={cn('rounded-sm', className)}
    >
      <div className="flex items-center gap-1 text-sm">
        {option.label}
        {tooltip && (
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        )}
      </div>
    </Checkbox>
  )
}
