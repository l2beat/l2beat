import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'
import { cn } from '../utils/cn'

type InputProps = Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> &
  VariantProps<typeof inputVariants>

const inputVariants = cva(
  'placeholder:text-coffee-200/40 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border border-coffee-400 bg-coffee-400/20 focus:border-coffee-300',
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
        className={cn(className, inputVariants({ variant, size }))}
        {...props}
      />
    )
  },
)

export function InputDescription({ children }: { children: React.ReactNode }) {
  return <p className="w-full text-right text-coffee-400 text-xs">{children}</p>
}
