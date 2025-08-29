import { useMemo } from 'react'
import { LinkWithThumbnail } from '~/components/LinkWithThumbnail'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import type { PublicationEntry } from '../utils/getPublicationEntry'

export function PublicationsList({
  publications,
}: {
  publications: PublicationEntry[]
}) {
  const filterPublications = useFilterEntries()

  const filteredPublications = useMemo(
    () => publications.filter(filterPublications),
    [publications, filterPublications],
  )

  return (
    <>
      <TableFilters entries={publications} />
      <PrimaryCard className="mt-4 grid grid-cols-1 gap-x-4 gap-y-12 md:grid-cols-2 md:p-8 lg:grid-cols-3">
        {filteredPublications.map((publication) => (
          <PublicationCard publication={publication} key={publication.id} />
        ))}
      </PrimaryCard>
    </>
  )
}

function PublicationCard({ publication }: { publication: PublicationEntry }) {
  return (
    <LinkWithThumbnail
      {...publication.thumbnail}
      href={`/governance/publications/${publication.id}`}
      title={publication.shortTitle ?? publication.title}
      topAccessory={
        <div className="flex items-center gap-2">
          <Tag tag={publication.tag} />
          <span className="font-medium text-brand text-label-value-12">
            {publication.publishedOn}
          </span>
        </div>
      }
      description={publication.description}
      orientation="vertical"
      className="justify-self-center"
    />
  )
}

function Tag({ tag }: { tag: string }) {
  return (
    <div className="rounded-sm border border-brand px-[5px] py-[4.5px] font-bold text-brand text-label-value-13 uppercase">
      {tag}
    </div>
  )
}
