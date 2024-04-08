import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'

interface SquareProps extends VariantProps<typeof squareVariants> {}

const squareVariants = cva('', {
  variants: {
    variant: {
      default: 'bg-black dark:bg-white rounded',
      canonical: 'bg-purple-100 rounded',
      external: 'bg-yellow-200 rounded',
      native: 'bg-pink-100 rounded',
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

export function Square({ variant, size }: SquareProps) {
  return (
    <div
      role="img"
      aria-label="Square icon"
      className={squareVariants({ variant, size })}
    />
  )
}
