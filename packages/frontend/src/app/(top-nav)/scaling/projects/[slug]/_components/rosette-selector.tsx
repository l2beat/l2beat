import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { InfoIcon } from '~/icons/info'
import { cn } from '~/utils/cn'

export type RosetteType = 'individual' | 'combined'

type Props = {
  rosetteType: RosetteType
  setRosetteType: (rosetteType: RosetteType) => void
  className?: string
  isDisabled?: boolean
}

export function RosetteSelector({
  rosetteType,
  setRosetteType,
  className,
  isDisabled = false,
}: Props) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <RadioGroup
        value={rosetteType}
        onValueChange={setRosetteType}
        disabled={isDisabled}
      >
        <RadioGroupItem value="combined">Combined</RadioGroupItem>
        <RadioGroupItem value="individual">Individual</RadioGroupItem>
      </RadioGroup>
      <Tooltip>
        <TooltipTrigger>
          <InfoIcon />
        </TooltipTrigger>
        <TooltipContent>
          The combined view shows the L3 risk (based on both the L2 and the L3).
          The individual view displays the L2 and L3 risks separately.
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
