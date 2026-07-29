import type { ComponentProps } from 'react'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { cn } from '~/utils/cn'

export function HomeCard({
  className,
  ...props
}: ComponentProps<typeof PrimaryCard>) {
  return (
    <PrimaryCard className={cn('p-4 md:px-6 md:py-4', className)} {...props} />
  )
}
