import type { ReferenceLink } from '@l2beat/config'
import { CustomLink } from '~/components/link/custom-link'
import { cn } from '~/utils/cn'

export interface ReferenceListProps {
  references: ReferenceLink[]
  tight?: boolean
}

export function ReferenceList({ references, tight }: ReferenceListProps) {
  if (references.length === 0) {
    return null
  }
  return (
    <ol className={cn('text-xs', tight ? 'mt-2' : 'mt-4 md:mt-6')}>
      {references.map((reference, i) => (
        <li key={i}>
          <CustomLink href={reference.url}>{reference.title}</CustomLink>
        </li>
      ))}
    </ol>
  )
}
