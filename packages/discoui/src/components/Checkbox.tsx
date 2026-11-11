import { Icon } from '../icons/Icon'
import { IconChecked } from '../icons/IconChcked'
import { cn } from '../utils/cn'

type CheckboxProps = {
  checked: 'indeterminate' | boolean
  onClick?: () => void
  className?: string
  id?: string
  disabled?: boolean
}

export function Checkbox({
  checked,
  onClick,
  className,
  id,
  disabled,
}: CheckboxProps) {
  return (
    <div
      role="checkbox"
      aria-checked={checked === 'indeterminate' ? 'mixed' : checked}
      className={cn(
        'flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-xs border border-coffee-500 bg-coffee-900 text-coffee-100 transition-colors hover:border-coffee-300 disabled:cursor-not-allowed disabled:opacity-50',
        checked === true &&
          'border-autumn-300 bg-autumn-300/15 text-autumn-300',
        className,
      )}
      onClick={disabled ? undefined : onClick}
      id={id}
    >
      {checked === true && <IconChecked className="size-3 stroke-current" />}
      {checked === 'indeterminate' && <Indeterminate />}
      {checked === false && <span className="size-3" />}
    </div>
  )
}

function Indeterminate() {
  return (
    <Icon className="size-3 stroke-2 stroke-coffee-200">
      <line x1="3" y1="8" x2="13" y2="8" />
    </Icon>
  )
}
