import { type Sentiment } from '@l2beat/shared-pure'
import { cn } from '~/utils/cn'
import { sentimentToOpaqueBgColor } from '~/utils/sentiment'

export function SingleGrissini({
  sentiment,
  className,
}: { sentiment: Sentiment; className?: string }) {
  return (
    <div
      className={cn(
        'h-8 w-2 rounded-full',
        sentimentToOpaqueBgColor(sentiment),
        className,
      )}
    />
  )
}
