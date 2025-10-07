import { UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { LinkWithThumbnail } from '~/components/LinkWithThumbnail'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { externalLinks } from '~/consts/externalLinks'
import { formatPublicationDate } from '~/utils/dates'
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
        <div className="col-span-full row-start-2 flex w-full items-center justify-center gap-6 rounded-lg bg-[url(/images/publications/newsletter-box.png)] bg-center bg-cover py-5 pr-8 pl-6 text-white max-md:flex-col">
          <div className="space-y-3">
            <div className="font-bold text-heading-24">
              Want to get notified about new publications?
            </div>
            <div className="font-normal text-paragraph-14">
              Get the latest insights - covering Ethereum Layer 2 ecosystem
              updates, in-depth research and transparency reports, governance
              proposals, and more.
            </div>
          </div>
          <a
            className="flex h-fit items-center justify-center whitespace-nowrap rounded-sm bg-white px-6 py-4 font-bold text-label-value-16 text-neutral-900 max-md:w-full"
            href={externalLinks.substackSubscribe}
            target="_blank"
          >
            Subscribe to our newsletter
          </a>
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
      href={publication.url}
      title={publication.shortTitle ?? publication.title}
      topAccessory={
        <div className="flex items-center gap-2">
          <PublicationTag tag={publication.tag} />
          <span className="font-medium text-brand text-label-value-12">
            {formatPublicationDate(UnixTime.toDate(publication.publishedOn))}
          </span>
        </div>
      }
      description={publication.description}
      customCtaText={publication.customCtaText}
      orientation="vertical"
      className="justify-self-center"
    />
  )
}

export function PublicationTag({ tag }: { tag: PublicationEntry['tag'] }) {
  return (
    <div className="whitespace-nowrap rounded-sm border border-brand px-[5px] py-[4.5px] font-bold text-brand text-label-value-13 uppercase">
      {tag === 'monthly-update' ? 'Monthly Update' : tag}
    </div>
  )
}
