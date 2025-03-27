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
        'flex h-[200px] flex-1 cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-200 px-4 py-2 text-center',
        props.checked && 'bg-pink-900/30',
      )}
      onClick={() => props.onCheck(!props.checked)}
    >
      {props.image}
      <br />
      <div className="text-lg font-bold">{props.title}</div>
      {props.subTitle && <div className="text-sm italic">{props.subTitle}</div>}
    </div>
  )
}
