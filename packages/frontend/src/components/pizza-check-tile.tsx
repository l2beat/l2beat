import clsx from 'clsx'
import type { ReactNode } from 'react'

type PizzaCheckTileProps = {
  title: string
  subTitle?: string
  image?: ReactNode
  onCheck: (checked: boolean) => void
  checked: boolean
}

export function PizzaCheckTile(props: PizzaCheckTileProps) {
  return (
    <div
      className={clsx(
        'flex flex-1 cursor-pointer flex-col items-center justify-center rounded-lg text-center transition-colors md:p-8 py-5',
        props.checked
          ? 'bg-pink-100/30 hover:bg-pink-100/40 dark:bg-pink-200/30 dark:hover:bg-pink-200/40'
          : 'bg-surface-secondary hover:bg-surface-secondary/80',
      )}
      onClick={() => props.onCheck(!props.checked)}
    >
      <div className="flex flex-1 items-center justify-center">
        {props.image}
      </div>
      <div className="text-xs font-bold md:text-lg">{props.title}</div>
    </div>
  )
}
