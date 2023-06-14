import cx from 'classnames'
import React from 'react'

import { Link } from '../Link'

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
    <ol className={cx('text-xs', tight ? 'mt-2' : 'mt-4 md:mt-6')}>
      {references.map((reference, i) => (
        <li key={i}>
          <Link href={reference.href}>{reference.text}</Link>
        </li>
      ))}
    </ol>
  )
}
