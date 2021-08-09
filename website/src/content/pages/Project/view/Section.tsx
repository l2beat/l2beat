import cx from 'classnames'
import { ReactNode } from 'react'
import { Heading } from '../../../common'

interface Props {
  title: string
  id: string
  className?: string
  editLink?: string
  issueLink?: string
  children: ReactNode
}

export function Section(props: Props) {
  const links = []
  if (props.editLink) {
    links.push({ name: 'Edit', href: props.editLink })
  }
  if (props.issueLink) {
    links.push({ name: 'Issue', href: props.issueLink })
  }
  return (
    <section className={cx('ProjectDetails-Section', props.className)}>
      <Heading
        id={props.id}
        level={2}
        title={props.title}
        links={links}
        className="ProjectDetails-Title"
      />
      {props.children}
    </section>
  )
}
