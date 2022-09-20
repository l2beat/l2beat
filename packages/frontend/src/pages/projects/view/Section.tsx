import cx from 'classnames'
import React, { ReactNode } from 'react'

import { Heading } from '../../../components'

interface Props {
  title: string
  id: string
  className?: string
  children: ReactNode
}

export function Section(props: Props) {
  return (
    <section className={cx('Section', props.className)}>
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
