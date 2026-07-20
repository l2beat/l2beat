import { Badge } from '~/components/badge/Badge'
import { DiffBody } from '~/components/discovery/DiffBody'
import { Markdown } from '~/components/markdown/Markdown'
import {
  getPaginationItems,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '~/components/Pagination'
import { ChevronIcon } from '~/icons/Chevron'
import type { DiscoveryUpdate } from '~/server/features/projects/recent-changes/getDiscoveryUpdates'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface UpdatesSectionProps extends ProjectSectionProps {
  updates: DiscoveryUpdate[]
  selectedUpdateId?: string
  updatesPage?: number
}

const SECTION_TITLES = {
  'initial-discovery': 'Initial discovery',
  'watched-changes': null,
} satisfies Record<DiscoveryUpdate['sections'][number]['kind'], string | null>

const PAGE_SIZE = 5

export function UpdatesSection({
  updates,
  selectedUpdateId,
  updatesPage,
  ...sectionProps
}: UpdatesSectionProps) {
  if (updates.length === 0) {
    return null
  }

  const pageCount = Math.ceil(updates.length / PAGE_SIZE)
  const selectedUpdateIndex = updates.findIndex(
    (update) => update.id === selectedUpdateId,
  )
  const selectedUpdatePage =
    selectedUpdateIndex === -1
      ? undefined
      : Math.floor(selectedUpdateIndex / PAGE_SIZE)
  const page = Math.min(
    Math.max(selectedUpdatePage ?? updatesPage ?? 0, 0),
    pageCount - 1,
  )
  const entries = updates.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <ProjectSection {...sectionProps}>
      <div className="flex flex-col gap-3">
        {entries.map((update) => (
          <UpdateCard
            key={update.id}
            update={update}
            isSelected={update.id === selectedUpdateId}
          />
        ))}
        {pageCount > 1 && (
          <UpdatesPagination page={page} pageCount={pageCount} />
        )}
      </div>
    </ProjectSection>
  )
}

function UpdatesPagination({
  page,
  pageCount,
}: {
  page: number
  pageCount: number
}) {
  return (
    <Pagination className="pt-2">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={getUpdatesPageHref(Math.max(page - 1, 0))}
            aria-disabled={page === 0}
            className={cn(page === 0 && 'pointer-events-none opacity-40')}
          />
        </PaginationItem>
        {getPaginationItems(pageCount, page).map((item) =>
          item.type === 'ellipsis' ? (
            <PaginationItem key={item.key}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item.index}>
              <PaginationLink
                href={getUpdatesPageHref(item.index)}
                isActive={item.index === page}
              >
                {item.index + 1}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            href={getUpdatesPageHref(Math.min(page + 1, pageCount - 1))}
            aria-disabled={page === pageCount - 1}
            className={cn(
              page === pageCount - 1 && 'pointer-events-none opacity-40',
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

function getUpdatesPageHref(page: number): string {
  return `?updatesPage=${page + 1}#updates`
}

function UpdateCard({
  update,
  isSelected,
}: {
  update: DiscoveryUpdate
  isSelected: boolean
}) {
  return (
    <details
      id={update.id}
      open={isSelected}
      className="group w-full min-w-0 scroll-mt-[38px] overflow-hidden rounded-lg border border-divider bg-surface-primary md:scroll-mt-14 lg:scroll-mt-4"
    >
      <summary
        className={cn(
          'flex w-full cursor-pointer list-none flex-col gap-2 px-4 py-3 text-left text-sm marker:hidden',
          'hover:bg-surface-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand',
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
            <a
              href={`?update=${update.id}#${update.id}`}
              aria-label={`Link to update from ${formatUpdateDate(update)}`}
              title="Link to this update"
              className="shrink-0 rounded-sm font-medium text-primary leading-snug hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              {formatUpdateDate(update)}
            </a>
            {update.isHighSeverity && (
              <Badge
                type="error"
                size="extraSmall"
                padding="small"
                className="shrink-0 uppercase"
              >
                High severity
              </Badge>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="flex items-baseline gap-1">
              <span className="font-medium text-primary tabular-nums">
                {update.changeCount}
              </span>
              <span className="text-2xs text-secondary normal-case">
                {update.changeCount === 1 ? 'change' : 'changes'}
              </span>
            </div>
            <ChevronIcon className="group-open:-rotate-180 size-3 shrink-0 fill-secondary transition-transform duration-200" />
          </div>
        </div>
        {update.description.trim().length > 0 && (
          <p
            className={cn(
              'line-clamp-1 min-w-0 font-normal',
              'text-secondary text-xs leading-snug',
              'group-open:hidden',
            )}
          >
            {plainText(update.description)}
          </p>
        )}
      </summary>
      <div className="flex min-w-0 flex-col gap-4 border-divider border-t px-4 py-4">
        {update.description.trim().length > 0 && (
          <div
            className="min-w-0 max-w-full rounded-lg border border-divider bg-surface-secondary px-4 py-3.5 dark:bg-surface-primary"
            role="region"
            aria-label="Update description"
          >
            <Markdown
              ignoreGlossary
              className={cn(
                'min-w-0 max-w-full text-primary text-sm leading-relaxed [overflow-wrap:anywhere]',
                '[&_p:last-child]:mb-0 [&_p]:mb-2',
                '[&_li]:marker:text-secondary [&_ol]:mb-2 [&_ul]:mb-2',
                '[&_a]:break-all [&_a]:text-link',
              )}
            >
              {update.description}
            </Markdown>
          </div>
        )}
        {update.sections.map((section, index) => {
          const title = SECTION_TITLES[section.kind]
          return (
            <div key={index} className="flex min-w-0 flex-col gap-2">
              {title && (
                <h4 className="font-bold text-secondary text-xs uppercase">
                  {title}
                </h4>
              )}
              <DiffBody body={section.body} />
            </div>
          )
        })}
      </div>
    </details>
  )
}

function formatUpdateDate(update: DiscoveryUpdate): string {
  if (update.timestamp === null) {
    return update.date
  }

  return formatTimestamp(update.timestamp, {
    longMonthName: true,
    mode: 'datetime',
  })
}

function plainText(markdown: string): string {
  return markdown
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`#>|]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
