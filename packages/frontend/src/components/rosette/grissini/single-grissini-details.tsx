import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import { cn } from '~/utils/cn'
import {
  sentimentToTextColor,
  sentimentToTransparentBgColor,
} from '~/utils/sentiment'
import type { RosetteValue } from '../types'
import { SingleGrissini } from './single-grissini'
interface SingleGrissiniDetailsProps extends RosetteValue {
  className?: string
  size?: 'small' | 'regular'
  showTooltip?: boolean
}

export function SingleGrissiniDetails({
  name,
  sentiment,
  value,
  className,
  size = 'regular',
  description,
  showTooltip,
}: SingleGrissiniDetailsProps) {
  const content = (
    <div
      className={cn(
        'flex flex-row items-stretch rounded',
        size === 'small' && 'h-12',
        size === 'regular' && 'h-12 md:h-[5.125rem]',
        sentimentToTransparentBgColor(sentiment ?? 'neutral'),
        className,
      )}
    >
      <SingleGrissini
        sentiment={sentiment ?? 'neutral'}
        className="h-full shrink-0 max-md:w-1"
      />
      <div className="flex flex-1 flex-col items-start justify-center gap-1 p-4">
        <div className="text-3xs font-semibold uppercase md:text-2xs">
          {name}
        </div>
        <div
          className={cn(
            'text-sm font-bold !leading-none md:text-lg',
            sentimentToTextColor(sentiment ?? 'neutral', { vibrant: true }),
          )}
        >
          {value}
        </div>
      </div>
    </div>
  )

  return showTooltip ? (
    <Tooltip>
      <TooltipTrigger>{content}</TooltipTrigger>
      <TooltipContent>{description}</TooltipContent>
    </Tooltip>
  ) : (
    content
  )
}
