import { ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
}

export function Section({ title, children }: Props) {
  return (
    <section className="ProjectDetails-Section">
      <h2 className="ProjectDetails-Title">{title}</h2>
      {children}
    </section>
  )
}
