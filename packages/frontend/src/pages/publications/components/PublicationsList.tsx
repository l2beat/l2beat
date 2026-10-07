import { UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { CountBadge } from '~/components/badge/CountBadge'
import { Button } from '~/components/core/Button'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/DirectoryTabs'
import { LinkWithThumbnail } from '~/components/LinkWithThumbnail'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { externalLinks } from '~/consts/externalLinks'
import { formatPublicationDate } from '~/utils/dates'
import type { PublicationEntry } from '../utils/getPublicationEntry'

export function PublicationsList({
  publications,
  newsletterBgUrl,
}: {
  publications: PublicationEntry[]
  newsletterBgUrl: string
}) {
  const filterPublications = useFilterEntries()

  const { research, updates } = useMemo(() => {
    const filtered = publications.filter(filterPublications)
    return {
      research: filtered.filter((p) => p.tag === 'Research'),
      updates: filtered.filter((p) => p.tag !== 'Research'),
    }
  }, [publications, filterPublications])

  return (
    <>
      <TableFilters
        entries={publications}
        className="max-md:mt-4 max-md:px-4"
      />
      <DirectoryTabs defaultValue="research">
        <DirectoryTabsList>
          <DirectoryTabsTrigger value="research">
            Research <CountBadge>{research.length}</CountBadge>
          </DirectoryTabsTrigger>
          <DirectoryTabsTrigger value="updates">
            Updates <CountBadge>{updates.length}</CountBadge>
          </DirectoryTabsTrigger>
        </DirectoryTabsList>
        <DirectoryTabsContent value="research" className="md:p-8">
          <PublicationsGrid
            publications={research}
            newsletterBgUrl={newsletterBgUrl}
          />
        </DirectoryTabsContent>
        <DirectoryTabsContent value="updates" className="md:p-8">
          <PublicationsGrid
            publications={updates}
            newsletterBgUrl={newsletterBgUrl}
          />
        </DirectoryTabsContent>
      </DirectoryTabs>
    </>
  )
}

function PublicationsGrid({
  publications,
  newsletterBgUrl,
}: {
  publications: PublicationEntry[]
  newsletterBgUrl: string
}) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
      <div
        className="col-span-full row-start-2 flex w-full items-center justify-center gap-6 rounded-lg bg-center bg-cover py-5 pr-8 pl-6 text-white max-md:flex-col"
        style={{ backgroundImage: `url(${newsletterBgUrl})` }}
      >
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
        <Button
          className="h-fit whitespace-nowrap py-4 text-label-value-16 max-md:w-full"
          asChild
        >
          <a
            href={externalLinks.substackSubscribe}
            target="_blank"
            rel="noreferrer noopener"
          >
            Subscribe to our newsletter
          </a>
        </Button>
      </div>
      {publications.map((publication) => (
        <PublicationCard publication={publication} key={publication.id} />
      ))}
    </div>
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
