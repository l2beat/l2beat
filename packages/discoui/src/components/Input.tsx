import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'
import { cn } from '../utils/cn'

type InputProps = Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> &
  VariantProps<typeof inputVariants>

const inputVariants = cva(
  'placeholder:text-coffee-400 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'rounded-sm border border-coffee-600 bg-coffee-800 text-coffee-100 focus:border-autumn-300',
        ghost: 'border-none bg-transparent',
      },
      size: {
        default: 'px-2 py-1 text-sm',
        sm: 'px-1.5 py-0.5 text-xs',
        lg: 'px-3 py-2 text-base',
        ghost: 'h-full w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <input
        ref={ref}
        onKeyUp={(e) => {
          e.stopPropagation()
          props.onKeyUp?.(e)
        }}
        onKeyDown={(e) => {
          e.stopPropagation()
          props.onKeyDown?.(e)
        }}
        className={cn(inputVariants({ variant, size }), className)}
        {...props}
      />
    )
  },
)

export function InputDescription({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-coffee-400 text-xs">{children}</p>
}
