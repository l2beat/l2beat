import clsx from 'clsx'

type Props = {
  type: string
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  active?: boolean
}

export function TypeTile(props: Props) {
  return (
    <button
      disabled={props.disabled}
      onClick={props.onClick}
      className={clsx(
        'flex flex-1 flex-col items-center justify-center gap-1 border border-coffee-200 p-4',
        'cursor-pointer',
        props.disabled && 'cursor-not-allowed opacity-50',
        !props.active && !props.disabled && 'hover:bg-coffee-600/50',
        props.active && 'bg-coffee-600',
      )}
    >
      <div className="font-bold text-2xl">{props.type}</div>
      <div className="text-center font-thin text-sm">{props.children}</div>
    </button>
  )
}
