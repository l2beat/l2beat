import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import { cn } from '~/utils/cn'
import type { SvgIconProps } from './SvgIcon'
import { SvgIcon } from './SvgIcon'

const infoVariants = cva(undefined, {
  variants: {
    variant: {
      gray: 'fill-secondary',
      blue: 'fill-blue-500',
      yellow: 'fill-yellow-900',
    },
  },
  defaultVariants: {
    variant: 'gray',
  },
})

export function InfoIcon({
  variant,
  className,
  ...props
}: SvgIconProps & VariantProps<typeof infoVariants>) {
  return (
    <SvgIcon
      aria-label="Info icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className={cn(infoVariants({ variant }), className)}
      {...props}
    >
      <path d="M8 16A8 8 0 108 0a8 8 0 000 16M6.696 4.304a1.304 1.304 0 112.608 0 1.304 1.304 0 01-2.608 0m.435 3.479a.87.87 0 011.739 0v4.347a.87.87 0 01-1.74 0z" />
    </SvgIcon>
  )
}
