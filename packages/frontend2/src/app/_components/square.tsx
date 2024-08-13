import { type VariantProps, cva } from 'class-variance-authority'
import React from 'react'

interface SquareProps extends VariantProps<typeof squareVariants> {
  className?: string
}

const squareVariants = cva('rounded', {
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
      ether: 'bg-green-900 dark:bg-green-200',
      stable: 'bg-teal-500 dark:bg-teal-400',
      other: 'bg-sky-600',
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
