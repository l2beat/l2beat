import { cn } from '~/utils/cn'

export type PrivacyAmountScale = 'lin' | 'log'

const OPTIONS: { value: PrivacyAmountScale; label: string }[] = [
  { value: 'lin', label: 'LIN' },
  { value: 'log', label: 'LOG' },
]

interface Props {
  value: PrivacyAmountScale
  onChange: (value: PrivacyAmountScale) => void
}

export function PrivacyAmountScaleToggle({ value, onChange }: Props) {
  return (
    <div
      className={cn(
        'inline-flex h-8 w-max items-center gap-1 rounded-lg p-1 font-medium',
        'bg-surface-primary primary-card:bg-surface-secondary',
      )}
    >
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          data-state={value === option.value ? 'checked' : 'unchecked'}
          className={cn(
            'h-full rounded-md px-2 text-xs md:text-sm',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-transparent',
            'data-[state=checked]:bg-surface-tertiary primary-card:data-[state=checked]:bg-pure-white dark:primary-card:data-[state=checked]:bg-black',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
