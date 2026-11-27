import { cn } from '~/utils/cn'
import { decadesOf, type LogScale, logPercent } from '../utils/logScale'

/** A label at each decade; on phones every other one from the first, and the last */
export function DecadeAxis({
  scale,
  format,
  className,
}: {
  scale: LogScale
  format: (decade: number) => string
  className?: string
}) {
  const decades = decadesOf(scale)
  const lastIndex = decades.length - 1
  return (
    <div
      className={cn('relative h-4 w-full text-2xs text-secondary', className)}
    >
      {decades.map((decade, i) => (
        <span
          key={decade}
          className={cn(
            'absolute whitespace-nowrap',
            i === 0
              ? ''
              : i === lastIndex
                ? '-translate-x-full'
                : '-translate-x-1/2',
            i % 2 === 1 && i !== lastIndex && 'max-md:hidden',
          )}
          style={{ left: logPercent(scale, decade) }}
        >
          {format(decade)}
        </span>
      ))}
    </div>
  )
}

/** "0.000001", "10" */
export function formatDecade(decade: number) {
  return decade.toLocaleString('en-US', { maximumFractionDigits: 12 })
}

/** "$0.0001", "$1" */
export function formatUsdDecade(decade: number) {
  return `$${formatDecade(decade)}`
}

/** "0.01¢" below a dollar, then "$1" */
export function formatCentsDecade(decade: number) {
  return decade >= 1
    ? formatUsdDecade(decade)
    : `${formatDecade(decade * 100)}¢`
}
