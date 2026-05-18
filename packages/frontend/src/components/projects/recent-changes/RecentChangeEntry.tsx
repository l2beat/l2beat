import { useState } from 'react'
import { Badge } from '~/components/badge/Badge'
import { Markdown } from '~/components/markdown/Markdown'
import { ChevronIcon } from '~/icons/Chevron'
import type {
  PublicDiffHistoryEntry,
  PublicDiffHistorySectionKind,
} from '~/server/features/projects/recent-changes/getRecentChanges'
import { cn } from '~/utils/cn'
import { DiffBlock } from './DiffBlock'

interface Props {
  entry: PublicDiffHistoryEntry
  defaultOpen?: boolean
}

const SECTION_TITLE: Record<PublicDiffHistorySectionKind, string | null> = {
  'watched-changes': null,
  'initial-discovery': 'Initial discovery',
}

export function RecentChangeEntry({ entry, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <article className="w-full min-w-0 overflow-hidden rounded-lg border border-divider bg-surface-primary">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          'flex w-full flex-col gap-2 px-4 py-3 text-left text-sm',
          'hover:bg-surface-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand',
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
            <span className="shrink-0 font-medium text-primary leading-snug">
              {entry.date}
            </span>
            {entry.highSeverity && (
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
                {entry.watchedChangeCount}
              </span>
              <span className="text-2xs text-secondary normal-case">
                {entry.watchedChangeCount === 1 ? 'change' : 'changes'}
              </span>
            </div>
            <ChevronIcon
              className={cn(
                'size-3 shrink-0 fill-secondary transition-transform duration-200',
                open && '-rotate-180',
              )}
            />
          </div>
        </div>
        {!open && entry.description.trim().length > 0 && (
          <p className="line-clamp-1 min-w-0 font-normal text-secondary text-xs leading-snug">
            {plainDescriptionOneLine(entry.description)}
          </p>
        )}
      </button>
      {open && (
        <div className="flex min-w-0 flex-col gap-4 border-divider border-t px-4 py-4">
          {entry.description.trim().length > 0 && (
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
                {entry.description}
              </Markdown>
            </div>
          )}
          {entry.sections.map((section, i) => {
            const title = SECTION_TITLE[section.kind]
            return (
              <div key={i} className="flex min-w-0 flex-col gap-2">
                {title && (
                  <h4 className="font-bold text-secondary text-xs uppercase">
                    {title}
                  </h4>
                )}
                <DiffBlock body={section.body} />
              </div>
            )
          })}
        </div>
      )}
    </article>
  )
}

/** Plain text for collapsed preview; visual truncation is `line-clamp-1` on the host. */
function plainDescriptionOneLine(markdown: string): string {
  return markdown
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`#>|]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
