import { cn } from '~/utils/cn'
import { Badge } from '../badge'

export function HiringBadge({ className }: { className?: string }) {
  return (
    <Badge
      type="purple"
      className={cn('ml-1 py-0.5 rounded-sm md:text-2xs', className)}
    >
      We&apos;re hiring
    </Badge>
  )
}
