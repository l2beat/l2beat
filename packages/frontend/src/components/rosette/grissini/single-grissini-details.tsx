import { type Sentiment } from '@l2beat/shared-pure'
import { cn } from '~/utils/cn'
import {
  sentimentToTextColor,
  sentimentToTransparentBgColor,
} from '~/utils/sentiment'
import { type RosetteValue } from '../types'
import { SingleGrissini } from './single-grissini'

export interface SingleGrissiniDetailsProps {
  name: string
  sentiment: Sentiment
  value: string
}

export function SingleGrissiniDetails({
  name,
  sentiment,
  value,
}: RosetteValue) {
  return (
    <div
      className={cn(
        'flex h-[5.125rem] flex-row items-stretch rounded-[4px]',
        sentimentToTransparentBgColor(sentiment),
      )}
    >
      <SingleGrissini sentiment={sentiment} className="h-full" />
      <div className="flex flex-1 flex-col justify-center gap-1 p-4">
        <div className="text-2xs font-semibold uppercase">{name}</div>
        <div
          className={cn(
            'text-lg font-bold leading-none',
            sentimentToTextColor(sentiment),
          )}
        >
          {value}
        </div>
      </div>
    </div>
  )
}
