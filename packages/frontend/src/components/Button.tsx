import { cva, VariantProps } from 'class-variance-authority'
import React, { ComponentPropsWithoutRef } from 'react'

import { cn } from '../utils/cn'

const buttonVariants = cva(
  'cursor-pointer flex justify-center items-center transition-colors duration-100 px-6 py-2 text-center font-bold',
  {
    variants: {
      variant: {
        default: 'bg-white text-black',
        purple: 'border border-pink-900 hover:bg-pink-900/25',
      },
      size: {
        default: 'text-base rounded-lg',
        sm: 'text-xs rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type Props<T extends React.ElementType> = {
  children: React.ReactNode
  as?: T
  className?: string
} & ComponentPropsWithoutRef<T> &
  VariantProps<typeof buttonVariants>

export function Button<T extends React.ElementType>({
  children,
  as,
  className,
  variant,
  size,
  ...rest
}: Props<T>) {
  const Comp = as ?? 'div'

  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...rest}
    >
      {children}
    </Comp>
  )
}
