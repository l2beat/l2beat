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
        <div className="relative col-span-full row-start-2 h-[120px] w-full">
          <img
            src="/images/publications/newsletter-box.png"
            alt="Publications"
            className="absolute inset-0 h-full w-full rounded-lg object-cover object-center"
          />
          <div className="z-10 flex flex-col">
            <div className="font-bold text-heading-24 text-white">
              Want to get notified about new publications?
            </div>
            <div>
              Get the latest insights - covering Ethereum Layer 2 ecosystem
              updates, in-depth research and transparency reports, governance
              proposals, and more.
            </div>
          </div>
        </div>
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
