import clsx from 'clsx'
import { Icon } from '../icons/Icon'
import { IconChecked } from '../icons/IconChcked'

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
      className={clsx(
        'flex size-4 cursor-pointer items-center justify-center border-coffee-400 bg-coffee-700 hover:bg-coffee-700/50 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      onClick={disabled ? undefined : onClick}
      id={id}
    >
      {checked === true && <IconChecked />}
      {checked === 'indeterminate' && <Indeterminate />}
      {checked === false && <span className="w-4" />}
    </div>
  )
}

function Indeterminate() {
  return (
    <Icon className="stroke-2 stroke-coffee-200">
      <line x1="3" y1="8" x2="13" y2="8" />
    </Icon>
  )
}
