import { Badge } from '~/components/core/Badge'
import { cn } from '~/utils/cn'

interface TransferTypeBadgeProps {
  transferType: string
  tone: 'included' | 'configured' | 'missing'
}

export function TransferTypeBadge({
  transferType,
  tone,
}: TransferTypeBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'font-mono text-[11px]',
        tone === 'included' &&
          'border-emerald-200 bg-emerald-50 text-emerald-700',
        tone === 'configured' && 'border-amber-200 bg-amber-50 text-amber-700',
        tone === 'missing' && 'border-rose-200 bg-rose-50 text-rose-700',
      )}
    >
      {transferType}
    </Badge>
  )
}
