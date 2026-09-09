import type { ComponentProps } from 'react'
import { cn } from '~/utils/cn'

export function DashedButton({
  className,
  ...props
}: ComponentProps<'button'>) {
  const isDisabled =
    props['aria-disabled'] === true || props['aria-disabled'] === 'true'
  return (
    <button
      type="button"
      {...props}
      className={cn(
        'flex items-center justify-center gap-1.5 border border-divider border-dashed font-medium text-secondary text-sm leading-none transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
        isDisabled
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer hover:bg-surface-primary',
        className,
      )}
    />
  )
}
