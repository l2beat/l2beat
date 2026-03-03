import { clsx } from 'clsx'
import { formatUsdValue } from '../utils/format'

interface UsdValueProps {
  value: number
  variant?: 'capital' | 'token' | 'default'
  className?: string
}

export function UsdValue({ value, variant = 'default', className }: UsdValueProps) {
  const colorClass =
    variant === 'capital'
      ? 'text-capital'
      : variant === 'token'
        ? 'text-token'
        : 'text-text-primary'

  return (
    <span className={clsx('font-medium tabular-nums', colorClass, className)}>
      {formatUsdValue(value)}
    </span>
  )
}
