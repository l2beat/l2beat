import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

interface SquareProps extends VariantProps<typeof squareVariants> {
  className?: string
}

const squareVariants = cva('shrink-0 rounded', {
  variants: {
    variant: {
      default: 'bg-black dark:bg-white',
      calldata: 'bg-sky-550 dark:bg-sky-500',
      blobs: 'bg-orange-400 dark:bg-yellow-100',
      compute: 'bg-pink-100',
      overhead: 'bg-purple-100',
      canonical: 'bg-purple-100',
      external: 'bg-yellow-200',
      native: 'bg-pink-100',
      associated: 'bg-rose-500 dark:bg-rose-700',
      ether: 'bg-chart-ethereum',
      btc: 'bg-orange-400',
      stable: 'bg-teal-500 dark:bg-teal-400',
      other: 'bg-sky-600',
      rwaPublic: 'bg-lime-650',
      rwaRestricted: 'bg-pink-750',
    },
    size: {
      small: 'size-3',
      default: 'size-4',
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
})

export function Square({ className, variant, size }: SquareProps) {
  return (
    <div
      role="img"
      aria-label="Square icon"
      className={squareVariants({ variant, size, className })}
    />
  )
}
