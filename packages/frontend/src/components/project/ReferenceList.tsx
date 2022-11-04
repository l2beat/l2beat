import React from 'react'

import { OutLink } from '../OutLink'

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
    <ol className="mt-4 md:mt-6 text-xs">
      {references.map((reference, i) => (
        <li key={i}>
          <OutLink className="text-link underline" href={reference.href}>
            {reference.text}
          </OutLink>
        </li>
      ))}
    </ol>
  )
}
