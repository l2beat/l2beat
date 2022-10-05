import classNames from 'classnames'
import React, { ReactNode } from 'react'

import { Heading } from '../Heading'

interface Props {
  title: string
  id: string
  className?: string
  children: ReactNode
}

export function Section(props: Props) {
  return (
    <section className={classNames('Section', props.className)}>
      <Heading
        id={props.id}
        level={2}
        title={props.title}
        className="Section-Title"
      />
      {props.children}
    </section>
  )
}
