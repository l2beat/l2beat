import { type Sentiment } from '@l2beat/shared-pure'
import { type RosetteValue } from '~/components/rosette/types'
import { cn } from '~/utils/cn'

type Props = {
  values: Omit<RosetteValue, 'name' | 'warning' | 'description'>[]
}

export function RiskGrissini({ values }: Props) {
  return (
    <div className="flex flex-row items-center justify-center gap-1">
      {values.map((value, i) => {
        const bgColor = sentimentToBgColor(value.sentiment)

        return <div className={cn('h-8 w-2 rounded-full', bgColor)} key={i} />
      })}
    </div>
  )
}

function sentimentToBgColor(sentiment: Sentiment): string {
  switch (sentiment) {
    case 'bad':
      return 'bg-orange-600'
    case 'warning':
      return 'bg-yellow-200'
    case 'good':
      return 'bg-green-300 dark:bg-green-450'
    case 'neutral':
    case 'UnderReview':
      return 'bg-gray-400 dark:bg-zinc-700'
  }
}
