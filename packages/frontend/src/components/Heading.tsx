import cx from 'classnames'
import React, { createElement, HTMLAttributes } from 'react'

export interface HeadingProps {
  level: number
  id: string
  title: string
  className?: string
}

export interface HeadingLink {
  name: string
  href: string
}

/**  @deprecated */
export function Heading(props: HeadingProps) {
  return (
    <Hx
      level={props.level}
      id={props.id}
      className={cx('Heading', `level-${props.level}`, props.className)}
    >
      <a className="Heading-Title" href={`#${props.id}`}>
        {props.title}
      </a>
    </Hx>
  )
}

function Hx({
  level,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { level: number }) {
  return createElement(`h${level}`, props)
}
