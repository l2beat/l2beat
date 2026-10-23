import { UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { CountBadge } from '~/components/badge/CountBadge'
import {
  DirectoryTabs,
  DirectoryTabsContent,
  DirectoryTabsList,
  DirectoryTabsTrigger,
} from '~/components/core/DirectoryTabs'
import { PlainLink } from '~/components/PlainLink'
import { TableFilters } from '~/components/table/filters/TableFilters'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { externalLinks } from '~/consts/externalLinks'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { CustomLinkIcon } from '~/icons/Outlink'
import { formatPublicationDate } from '~/utils/dates'
import { isExternalUrl } from '~/utils/isExternalUrl'
import type { PublicationEntry } from '../utils/getPublicationEntry'
import { getPublicationTagLabel } from './PublicationTag'

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
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
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
        <a
          className="flex h-fit items-center justify-center whitespace-nowrap rounded-sm bg-white px-6 py-4 font-bold text-label-value-16 text-neutral-900 max-md:w-full"
          href={externalLinks.substackSubscribe}
          target="_blank"
        >
          Subscribe to our newsletter
        </a>
      </div>
      {publications.map((publication) => (
        <PublicationCard publication={publication} key={publication.id} />
      ))}
    </div>
  )
}

function PublicationCard({ publication }: { publication: PublicationEntry }) {
  return (
    <PlainLink
      href={publication.url}
      className="group flex flex-col overflow-hidden rounded-lg border border-divider bg-pure-white transition-[border-color,box-shadow] hover:border-brand/40 hover:shadow-[0_6px_20px_-10px] hover:shadow-brand/40 dark:bg-surface-secondary"
    >
      <div className="overflow-hidden border-divider border-b">
        <img
          {...publication.thumbnail}
          alt={`Thumbnail of ${publication.title}`}
          className="aspect-video w-full object-cover object-center transition-[scale] will-change-transform group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex-1 px-4 pt-4">
        <p className="text-balance text-heading-18">
          {publication.shortTitle ?? publication.title}
        </p>
        {publication.description && (
          <p className="mt-2 line-clamp-3 text-paragraph-14 text-secondary">
            {publication.description}
          </p>
        )}
      </div>
      <div className="mx-4 mt-4 flex items-center gap-2 border-divider border-t py-3">
        <span className="font-bold text-brand text-label-value-12 uppercase">
          {getPublicationTagLabel(publication.tag)}
        </span>
        <span className="text-label-value-12 text-secondary">
          {formatPublicationDate(UnixTime.toDate(publication.publishedOn))}
        </span>
        <span className="ml-auto grid size-7 place-items-center rounded-full text-secondary transition-colors group-hover:bg-brand group-hover:text-pure-white">
          {isExternalUrl(publication.url) ? (
            <CustomLinkIcon className="size-3.5 fill-current" />
          ) : (
            <ArrowRightIcon className="size-3.5 fill-current" />
          )}
        </span>
      </div>
    </PlainLink>
  )
}
