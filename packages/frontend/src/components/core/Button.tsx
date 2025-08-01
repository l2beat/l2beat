import { Slot } from '@radix-ui/react-slot'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import { cn } from '~/utils/cn'

const buttonVariants = cva(
  'flex w-max cursor-pointer items-center justify-center px-6 py-2 text-center font-bold transition-colors duration-100',
  {
    variants: {
      variant: {
        default: 'bg-white text-black',
        outline: 'border border-pink-900 hover:bg-pink-900/25',
      },
      size: {
        default: 'rounded-lg text-base',
        sm: 'rounded-md text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps & {}) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
Button.displayName = 'Button'

export { Button, buttonVariants }
