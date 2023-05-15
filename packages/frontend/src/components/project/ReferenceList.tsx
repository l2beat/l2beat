import React from 'react'

import { Link } from '../Link'

export interface ReferenceListProps {
  references: TechnologyReference[]
}

export interface TechnologyReference {
  text: string
  href: string
}

export function ReferenceList({ references }: ReferenceListProps) {
  if (references.length === 0) {
    return null
  }
  return (
    <ol className="mt-4 text-xs md:mt-6">
      {references.map((reference, i) => (
        <li key={i}>
          <Link href={reference.href}>{reference.text}</Link>
        </li>
      ))}
    </ol>
  )
}
