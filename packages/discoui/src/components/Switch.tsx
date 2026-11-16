import { cn } from '../utils/cn'

export function Switch(props: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  id?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      id={props.id}
      aria-checked={props.checked}
      className={cn(
        'inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-100 focus:outline-hidden focus-visible:ring-1 focus-visible:ring-autumn-300 focus-visible:ring-offset-1 focus-visible:ring-offset-coffee-900',
        props.checked
          ? 'border-autumn-300 bg-autumn-300'
          : 'border-coffee-600 bg-coffee-700 hover:border-coffee-500',
      )}
      onClick={() => props.onCheckedChange(!props.checked)}
    >
      <span
        className={cn(
          'size-3.5 rounded-full transition-transform duration-100',
          props.checked
            ? 'translate-x-4.5 bg-coffee-900'
            : 'translate-x-0.5 bg-coffee-300',
        )}
      />
    </button>
  )
}
