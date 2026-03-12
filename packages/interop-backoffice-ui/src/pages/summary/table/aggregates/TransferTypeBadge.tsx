import { cn } from '~/utils/cn'

interface TransferTypeBadgeProps {
  children: string
  variant: 'seen' | 'configured' | 'missing'
}

export function TransferTypeBadge({
  children,
  variant,
}: TransferTypeBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[11px]',
        variant === 'seen' &&
          'border-emerald-200 bg-emerald-50 text-emerald-800',
        variant === 'configured' &&
          'border-amber-200 bg-amber-50 text-amber-800',
        variant === 'missing' && 'border-red-200 bg-red-50 text-red-800',
      )}
    >
      {children}
    </span>
  )
}
