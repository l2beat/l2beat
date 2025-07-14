import { CheckIcon } from '~/icons/Check'
import { cn } from '~/utils/cn'

export function TableFilterCheckbox({ checked }: { checked: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-sm text-current',
        checked && 'bg-brand',
        !checked && 'border border-brand',
      )}
    >
      <CheckIcon
        className={cn(
          'size-4 stroke-[1.8px]',
          'primary-card:stroke-surface-secondary! stroke-surface-primary!',
          !checked && 'opacity-0',
        )}
      />
    </div>
  )
}
