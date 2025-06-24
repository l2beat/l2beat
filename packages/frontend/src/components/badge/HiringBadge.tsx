import { cn } from '~/utils/cn'
import { Badge } from './Badge'

export function HiringBadge({ className }: { className?: string }) {
  return (
    <Badge
      type="pink"
      className={cn('ml-1 rounded-sm py-0.5 md:text-2xs', className)}
    >
      We&apos;re hiring
    </Badge>
  )
}
