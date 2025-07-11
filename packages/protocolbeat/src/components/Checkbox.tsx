import clsx from 'clsx'

type CheckboxProps = {
  checked: 'indeterminate' | boolean
  onClick?: () => void
  className?: string
  id?: string
}

export function Checkbox({ checked, onClick, className, id }: CheckboxProps) {
  return (
    <div
      className={clsx(
        'flex size-4 cursor-pointer items-center justify-center border-coffee-400 bg-coffee-700 hover:bg-coffee-700/50',
        className,
      )}
      onClick={onClick}
      id={id}
    >
      {checked === true && <CheckedTick />}
      {checked === 'indeterminate' && <Indeterminate />}
      {checked === false && <span className="w-4" />}
    </div>
  )
}

function CheckedTick() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className="fill-none stroke-coffee-200"
    >
      <path d="M2.5 8.5L6.5 12.5L13.5 4" strokeWidth="2" />
    </svg>
  )
}

function Indeterminate() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      className="fill-none stroke-coffee-200"
    >
      <line x1="3" y1="8" x2="13" y2="8" strokeWidth="2" />
    </svg>
  )
}
