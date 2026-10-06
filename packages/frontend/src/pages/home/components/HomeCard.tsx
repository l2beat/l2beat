import type { ComponentProps } from 'react'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { cn } from '~/utils/cn'

/**
 * A section of the home page: the site's own card, so home reads like every
 * other page. On phones cards run edge to edge and the page draws a hairline
 * between them instead of a gap (see HomePage).
 */
export function HomeCard({
  className,
  ...props
}: ComponentProps<typeof PrimaryCard>) {
  return <PrimaryCard className={cn('min-w-0', className)} {...props} />
}
