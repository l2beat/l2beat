import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '~/utils/cn'

const inputVariants = cva(
  'w-full border border-divider bg-surface-primary font-medium text-white outline-none transition-colors duration-200 placeholder:text-surface-secondary focus:border-[#5959B1]',
  {
    variants: {
      size: {
        sm: 'h-10 rounded-full px-4 py-2',
        md: 'h-14 rounded-[28px] p-5',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)

type Props = VariantProps<typeof inputVariants> & {
  error?: string
} & Omit<React.ComponentProps<'input'>, 'size'>

export function Input({
  size,
  className,
  placeholder,
  error,
  ...props
}: Props) {
  return (
    <input
      className={cn(
        inputVariants({ size }),
        error && 'placeholder:text-red-600',
        className,
      )}
      placeholder={error ?? placeholder}
      {...props}
    />
  )
}
