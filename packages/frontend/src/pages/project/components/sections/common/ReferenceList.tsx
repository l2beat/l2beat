import React from 'react'

import { Link } from '../../../../../components/Link'
import { cn } from '../../../../../utils/cn'

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
          <Link href={reference.href}>{reference.text}</Link>
        </li>
      ))}
    </ol>
  )
}
