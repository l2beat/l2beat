import { VariantProps, cva } from 'class-variance-authority'
import React from 'react'

interface SquareProps extends VariantProps<typeof squareVariants> {
  className?: string
}

const squareVariants = cva('rounded', {
  variants: {
    variant: {
      default: 'bg-black dark:bg-white',
      canonical: 'bg-purple-100',
      external: 'bg-yellow-200',
      native: 'bg-pink-100',
      associated: 'dark:bg-rose-700 bg-rose-500',
      ether: 'dark:bg-green-200 bg-green-900',
      stable: 'dark:bg-teal-400 bg-teal-500',
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
