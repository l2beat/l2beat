import type { ComponentProps } from 'react'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { cn } from '~/utils/cn'

/** A section of the home page: a card like on every other page. */
export function HomeCard({ className, ...props }: ComponentProps<'div'>) {
  return <PrimaryCard className={cn('min-w-0', className)} {...props} />
}
