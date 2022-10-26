import cx from 'classnames'
import React, { ReactNode } from 'react'

interface Props {
  title: string
  id: string
  className?: string
  children: ReactNode
}

export function Section(props: Props) {
  return (
    <section className={cx(props.className, 'mt-10 md:mt-16')}>
      <h2
        id={props.id}
        className="text-2xl md:text-4xl font-bold md:leading-normal"
      >
        <a href={`#${props.id}`}>{props.title}</a>
      </h2>
      {props.children}
    </section>
  )
}
