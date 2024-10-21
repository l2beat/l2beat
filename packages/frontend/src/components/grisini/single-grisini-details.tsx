import { Sentiment } from '@l2beat/shared-pure'
import { SingleGrisini } from './single-grisini'
import {
  sentimentToTextColor,
  sentimentToTransparentBgColor,
} from '~/utils/sentiment'
import { cn } from '~/utils/cn'
import { GrisiniValue } from './types'

export interface SingleGrisiniDetailsProps {
  name: string
  sentiment: Sentiment
  value: string
}

export function SingleGrisiniDetails({ name, sentiment, value }: GrisiniValue) {
  return (
    <div
      className={cn(
        'flex flex-row items-stretch h-[5.125rem] rounded-[4px]',
        sentimentToTransparentBgColor(sentiment),
      )}
    >
      <SingleGrisini sentiment={sentiment} className="h-full" />
      <div className="flex flex-col justify-center gap-1 flex-1 p-4">
        <div className="text-2xs font-semibold uppercase">{name}</div>
        <div
          className={cn('text-lg font-bold', sentimentToTextColor(sentiment))}
        >
          {value}
        </div>
      </div>
    </div>
  )
}
