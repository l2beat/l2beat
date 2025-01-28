import type { Sentiment } from '@l2beat/config'
import { cn } from '~/utils/cn'
import {
  sentimentToTextColor,
  sentimentToTransparentBgColor,
} from '~/utils/sentiment'
import { SingleGrissini } from './single-grissini'

interface SingleGrissiniDetailsProps {
  name: string
  sentiment: Sentiment
  value: string
  className?: string
}

export function SingleGrissiniDetails({
  name,
  sentiment,
  value,
  className,
}: SingleGrissiniDetailsProps) {
  return (
    <div
      className={cn(
        'flex h-12 flex-row items-stretch rounded md:h-[5.125rem]',
        sentimentToTransparentBgColor(sentiment),
        className,
      )}
    >
      <SingleGrissini
        sentiment={sentiment}
        className="h-full shrink-0 max-md:w-1"
      />
      <div className="flex flex-1 flex-col justify-center gap-1 p-4">
        <div className="text-3xs font-semibold uppercase md:text-2xs">
          {name}
        </div>
        <div
          className={cn(
            'text-sm font-bold !leading-none md:text-lg',
            sentimentToTextColor(sentiment, { vibrant: true }),
          )}
        >
          {value}
        </div>
      </div>
    </div>
  )
}
