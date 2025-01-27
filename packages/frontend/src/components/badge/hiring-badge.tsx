import { cn } from '~/utils/cn'
import { Badge } from './badge'

export function HiringBadge({ className }: { className?: string }) {
  return (
    <Badge
      type="pink"
      className={cn('rounded-xs md:text-2xs ml-1 py-0.5', className)}
    >
      We&apos;re hiring
    </Badge>
  )
}
