import cx from 'classnames'
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
      className={cx(
        'block relative select-none cursor-pointer',
        props.className,
      )}
    >
      <input
        className="peer cursor-pointer block absolute top-0 left-0 w-full h-full opacity-0"
        defaultChecked={props.checked}
        type="radio"
        name={props.name}
        value={props.value}
        data-endpoint={props.endpoint}
      />
      <span className="block relative pb-1 after:absolute after:w-full after:left-0 after:bottom-0.5 after:h-0.5 peer-checked:font-bold peer-checked:after:bg-current peer-focus-visible:outline-1 peer-focus-visible:outline-dotted outline-current">
        {props.children ?? props.value}
      </span>
    </label>
  )
}
