import type { Sentiment } from '@l2beat/config'
import type { HTMLAttributes } from 'react'
import { cn } from '~/utils/cn'
import { sentimentToOpaqueBgColor } from '~/utils/sentiment'

export function GrissiniStick({
  sentiment,
  className,
  ...rest
}: { sentiment: Sentiment } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'h-8 w-2 rounded-full',
        sentimentToOpaqueBgColor(sentiment),
        className,
      )}
      {...rest}
    />
  )
}
