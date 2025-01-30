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
  showTooltip?: boolean
}

export function SingleGrissiniDetails({
  name,
  sentiment,
  value,
  className,
  description,
  showTooltip,
}: SingleGrissiniDetailsProps) {
  const content = (
    <div
      className={cn(
        'flex h-12 flex-row items-stretch rounded md:h-[5.125rem]',
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
