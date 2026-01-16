import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const kbdVariants = cva(
  'flex items-center justify-center gap-1 rounded border-b-2 leading-none',
  {
    variants: {
      tone: {
        light: 'border-coffee-800 bg-coffee-400 text-coffee-800',
        dark: 'border-coffee-400/60 bg-coffee-700 text-coffee-200',
      },
      size: {
        default: 'px-1 text-sm',
        sm: 'px-0.5 text-xs',
      },
    },
    defaultVariants: {
      tone: 'light',
      size: 'default',
    },
  },
)

type Props = {
  keys: string[][]
  className?: string
} & VariantProps<typeof kbdVariants>

export function Kbd({ keys, className, ...props }: Props) {
  return (
    <kbd className={cn(kbdVariants(props), className)}>
      {keys.map((key) => key.join('+')).join(' ')}
    </kbd>
  )
}
