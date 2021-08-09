import cx from 'classnames'
import { ReactNode } from 'react'
import { EditLinks } from './EditLinks'

interface Props {
  title: string
  id?: string
  className?: string
  editLink?: string
  issueLink?: string
  children: ReactNode
}

export function Section(props: Props) {
  return (
    <section className={cx('ProjectDetails-Section', props.className)}>
      <h2 className="ProjectDetails-Title" id={props.id}>
        {props.title}
        {props.editLink && (
          <EditLinks editLink={props.editLink} issueLink={props.issueLink} />
        )}
      </h2>
      {props.children}
    </section>
  )
}
