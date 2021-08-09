import { ReactNode } from 'react'
import { EditLinks } from './EditLinks'

interface Props {
  title: string
  id?: string
  editLink?: string
  issueLink?: string
  children: ReactNode
}

export function Section({ id, title, editLink, issueLink, children }: Props) {
  return (
    <section className="ProjectDetails-Section">
      <h2 className="ProjectDetails-Title" id={id}>
        {title}
        {editLink && <EditLinks editLink={editLink} issueLink={issueLink} />}
      </h2>
      {children}
    </section>
  )
}
