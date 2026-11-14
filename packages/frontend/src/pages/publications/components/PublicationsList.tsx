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
import { HOME_BUTTON_CLASS } from '~/pages/home/homeStyles'
import { cn } from '~/utils/cn'
import { formatPublicationDate } from '~/utils/dates'
import { isExternalUrl } from '~/utils/isExternalUrl'
import type { PublicationEntry } from '../utils/getPublicationEntry'
import { getPublicationTagLabel } from './PublicationTag'

export function PublicationsList({
  publications,
}: {
  publications: PublicationEntry[]
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
        <DirectoryTabsContent value="research">
          <PublicationsGrid publications={research} />
        </DirectoryTabsContent>
        <DirectoryTabsContent value="updates">
          <PublicationsGrid publications={updates} />
        </DirectoryTabsContent>
      </DirectoryTabs>
    </>
  )
}

function PublicationsGrid({
  publications,
}: {
  publications: PublicationEntry[]
}) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
      {/* A flat ink block, like the mandate band on the rename page. */}
      <div className="home-theme col-span-full row-start-2">
        <div className="home-inverted flex w-full items-center justify-between gap-6 rounded-lg bg-surface-primary px-6 py-5 text-primary max-md:flex-col max-md:items-start">
          <div className="space-y-2">
            <div className="text-balance font-semibold text-heading-20 leading-6 tracking-[-0.01em]">
              Want to get notified about new publications?
            </div>
            <div className="text-label-value-15 text-secondary leading-5.5">
              Get the latest insights - covering Ethereum Layer 2 ecosystem
              updates, in-depth research and transparency reports, governance
              proposals, and more.
            </div>
          </div>
          <a
            className={cn(HOME_BUTTON_CLASS, 'shrink-0 whitespace-nowrap')}
            href={externalLinks.substackSubscribe}
            target="_blank"
          >
            Subscribe to our newsletter
            <CustomLinkIcon className="size-3 fill-current" />
          </a>
        </div>
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
      className="group flex flex-col overflow-hidden rounded-lg border border-divider bg-pure-white transition-colors hover:border-brand/40 dark:bg-surface-secondary"
    >
      <div className="overflow-hidden border-divider border-b">
        <img
          {...publication.thumbnail}
          alt={`Thumbnail of ${publication.title}`}
          className="aspect-video w-full object-cover object-center transition-[scale] will-change-transform group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex-1 px-4 pt-4">
        <p className="text-pretty font-semibold text-heading-20 leading-6 tracking-[-0.01em]">
          {publication.shortTitle ?? publication.title}
        </p>
        {publication.description && (
          <p className="mt-2 line-clamp-3 text-label-value-15 text-secondary leading-5.5">
            {publication.description}
          </p>
        )}
      </div>
      <div className="mx-4 mt-4 flex items-center gap-2 border-divider border-t py-3">
        <span className="font-bold text-brand-deep text-label-value-12 uppercase">
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
