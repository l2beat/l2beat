import React from 'react'

import { CustomLink } from '~/app/_components/link/custom-link'
import { cn } from '~/utils/cn'

export interface ReferenceListProps {
  references: TechnologyReference[]
  tight?: boolean
}

export interface TechnologyReference {
  text: string
  href: string
}

export function ReferenceList({ references, tight }: ReferenceListProps) {
  if (references.length === 0) {
    return null
  }
  return (
    <ol className={cn('text-xs', tight ? 'mt-2' : 'mt-4 md:mt-6')}>
      {references.map((reference, i) => (
        <li key={i}>
          <CustomLink href={reference.href}>{reference.text}</CustomLink>
        </li>
      ))}
    </ol>
  )
}
