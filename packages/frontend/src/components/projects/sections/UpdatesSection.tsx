import type {
  ProjectDiscoveryUpdateSection,
  ProjectDiscoveryUpdateSectionKind,
} from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { type MouseEvent, useState } from 'react'
import { Badge } from '~/components/badge/Badge'
import { CopyButton } from '~/components/CopyButton'
import { Skeleton } from '~/components/core/Skeleton'
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
import { useTRPC } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'
import {
  type ProjectDiscoveryUpdateSummary,
  UPDATES_PAGE_SIZE,
} from './updatesPaging'

export interface UpdatesSectionProps extends ProjectSectionProps {
  projectId: ProjectId
  updates: ProjectDiscoveryUpdateSummary[]
  selectedUpdateId?: string
}

const SECTION_TITLES = {
  'config-related-changes': 'New and verified contracts',
  'initial-discovery': 'Initial discovery',
  'watched-changes': null,
} satisfies Record<ProjectDiscoveryUpdateSectionKind, string | null>

export function UpdatesSection({
  projectId,
  updates,
  selectedUpdateId,
  ...sectionProps
}: UpdatesSectionProps) {
  const [page, setPage] = useState(() => {
    const selectedUpdateIndex = updates.findIndex(
      (update) => update.id === selectedUpdateId,
    )
    return selectedUpdateIndex === -1
      ? 0
      : Math.floor(selectedUpdateIndex / UPDATES_PAGE_SIZE)
  })

  const pageCount = Math.ceil(updates.length / UPDATES_PAGE_SIZE)
  const entries = updates.slice(
    page * UPDATES_PAGE_SIZE,
    (page + 1) * UPDATES_PAGE_SIZE,
  )
  const sections = usePageSections(projectId, entries)

  if (updates.length === 0) {
    return null
  }

  return (
    <ProjectSection {...sectionProps}>
      <div className="flex flex-col gap-3">
        {entries.map((update) => (
          <UpdateCard
            key={update.id}
            update={update}
            sections={sections.data?.[update.id]}
            sectionsFailed={sections.isError}
            isSelected={update.id === selectedUpdateId}
          />
        ))}
        {pageCount > 1 && (
          <UpdatesPagination
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        )}
      </div>
    </ProjectSection>
  )
}

function usePageSections(
  projectId: ProjectId,
  entries: ProjectDiscoveryUpdateSummary[],
) {
  const trpc = useTRPC()
  return useQuery(
    trpc.projects.discoveryUpdateSections.queryOptions({
      projectId,
      updateIds: entries.map((update) => update.id),
    }),
  )
}

function UpdatesPagination({
  page,
  pageCount,
  onPageChange,
}: {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
}) {
  const goToPage = (nextPage: number) => (event: MouseEvent) => {
    event.preventDefault()
    onPageChange(Math.min(Math.max(nextPage, 0), pageCount - 1))
  }

  return (
    <Pagination className="pt-2">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#updates"
            onClick={goToPage(page - 1)}
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
                href="#updates"
                isActive={item.index === page}
                onClick={goToPage(item.index)}
              >
                {item.index + 1}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            href="#updates"
            onClick={goToPage(page + 1)}
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

export function UpdateCard({
  update,
  sections,
  sectionsFailed = false,
  isSelected,
  copyLinkPath,
}: {
  update: ProjectDiscoveryUpdateSummary
  /** `undefined` while the diff bodies are still loading. */
  sections: ProjectDiscoveryUpdateSection[] | undefined
  sectionsFailed?: boolean
  isSelected: boolean
  copyLinkPath?: string
}) {
  return (
    <details
      id={update.id}
      open={isSelected}
      ref={(node) => {
        if (node && isSelected) {
          node.scrollIntoView({ block: 'start' })
        }
      }}
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
            <div className="flex shrink-0 items-center gap-1">
              <span className="font-medium text-primary leading-snug">
                {formatUpdateDate(update)}
              </span>
              <CopyButton
                toCopy={() =>
                  `${window.location.origin}${copyLinkPath ?? window.location.pathname}?update=${update.id}`
                }
                copyText="Copy link to update"
                className="rounded-sm text-secondary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                iconClassName="size-3.5"
              />
            </div>
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
        {sectionsFailed ? (
          <p className="text-secondary text-xs">Failed to load changes.</p>
        ) : (
          sections === undefined && <SectionsSkeleton />
        )}
        {sections?.map((section, index) => {
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

function SectionsSkeleton() {
  return (
    <div className="flex flex-col gap-2" aria-busy="true">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  )
}

function formatUpdateDate(update: ProjectDiscoveryUpdateSummary): string {
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
