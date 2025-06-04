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
      <path d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM6.6958 4.30435C6.6958 3.58391 7.27971 3 8.00015 3C8.72058 3 9.3045 3.58391 9.3045 4.30435C9.3045 5.02478 8.72058 5.6087 8.00015 5.6087C7.27971 5.6087 6.6958 5.02478 6.6958 4.30435ZM7.13058 7.78261C7.13058 7.30261 7.51971 6.91304 8.00015 6.91304C8.48058 6.91304 8.86971 7.30261 8.86971 7.78261V12.1304C8.86971 12.6104 8.48058 13 8.00015 13C7.51971 13 7.13058 12.6104 7.13058 12.1304V7.78261Z" />
    </SvgIcon>
  )
}
