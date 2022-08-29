import classNames from 'classnames'
import React, { ReactNode } from 'react'

interface Props {
  checked?: boolean
  name: string
  value: string
  endpoint?: string
  children?: ReactNode
  className?: string
}

export function ChartButton(props: Props) {
  return (
    <label
      className={classNames('block relative select-none', props.className)}
    >
      <input
        className="peer cursor-pointer block absolute top-0 left-0 w-full h-full opacity-0"
        defaultChecked={props.checked}
        type="radio"
        name={props.name}
        value={props.value}
        data-endpoint={props.endpoint}
      />
      <span className="flex min-w-[53px] h-[27px] px-1 rounded-md font-bold justify-center items-center bg-bg-2 peer-checked:bg-bg-4 peer-focus-visible:outline-2 peer-focus-visible:outline outline-current">
        {props.children ?? props.value}
      </span>
    </label>
  )
}
