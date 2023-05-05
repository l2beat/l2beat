import cx from 'classnames'
import React, { ReactNode } from 'react'

interface Props {
  title: string
  id: string
  className?: string
  children: ReactNode
}

export function ProjectDetailsSection(props: Props) {
  return (
    <section id={props.id} className={cx(props.className, 'mt-10 md:mt-16')}>
      <h2 className="mb-6 text-2xl font-bold md:text-4xl md:leading-normal">
        <a href={`#${props.id}`}>{props.title}</a>
      </h2>
      {props.children}
    </section>
  )
}
