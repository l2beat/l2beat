import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

const buttonVariants = cva(
  'flex items-center justify-center border border-coffee-400 font-medium text-sm transition-colors duration-100 hover:bg-coffee-400/50 disabled:opacity-50 disabled:hover:bg-transparent',
  {
    variants: {
      variant: {
        default: '',
        solid: 'bg-coffee-400/50 hover:bg-coffee-400/70',
        icon: 'border-none bg-transparent hover:bg-transparent',
        destructive: '!border-aux-red !bg-aux-red/10 hover:!bg-aux-red/20',
      },
      size: {
        default: 'px-4 py-1',
        small: 'px-2 py-0.5 text-xs',
        icon: 'size-4 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export function Button({
  children,
  variant,
  size,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {children}
    </button>
  )
}
