import type { ReferenceLink } from '@l2beat/config'
import { CustomLink } from '~/components/link/CustomLink'
import { cn } from '~/utils/cn'

interface ReferenceListProps {
  references: ReferenceLink[]
  tight?: boolean
}

export function ReferenceList({ references, tight }: ReferenceListProps) {
  if (references.length === 0) {
    return null
  }
  return (
    <ol
      className={cn(
        // Citations: a step under the prose, with room between multi-line titles.
        'space-y-1.5 text-paragraph-14 md:text-paragraph-15',
        tight ? 'mt-2' : 'mt-3',
      )}
    >
      {references.map((reference, i) => (
        <li key={i}>
          <CustomLink href={reference.url}>{reference.title}</CustomLink>
        </li>
      ))}
    </ol>
  )
}
