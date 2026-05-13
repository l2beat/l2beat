import { useState } from 'react'
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
  'source-code-changes': 'Source code changes',
}

export function RecentChangeEntry({ entry, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <article className="overflow-hidden rounded-lg border border-divider bg-surface-primary">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open ? 'true' : 'false'}
        className={cn(
          'flex w-full items-center justify-between gap-3 px-4 py-3 text-left font-medium text-sm',
          'hover:bg-surface-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand',
        )}
      >
        <span>{entry.date}</span>
        <ChevronIcon
          className={cn(
            'size-3 shrink-0 fill-secondary transition-transform duration-200',
            open && '-rotate-180',
          )}
        />
      </button>
      {open && (
        <div className="flex flex-col gap-4 border-divider border-t px-4 py-4">
          {entry.description.length > 0 && (
            <SummaryBlock>
              <Markdown
                ignoreGlossary
                className={cn(
                  'text-primary text-sm leading-relaxed',
                  '[&_p:last-child]:mb-0 [&_p]:mb-2',
                  '[&_li]:marker:text-secondary [&_ol]:mb-2 [&_ul]:mb-2',
                  '[&_a]:text-link',
                )}
              >
                {entry.description}
              </Markdown>
            </SummaryBlock>
          )}
          {entry.sections.map((section, i) => {
            const title = SECTION_TITLE[section.kind]
            return (
              <div key={i} className="flex flex-col gap-2">
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

function SummaryBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-brand/20 bg-brand/10 px-4 py-3.5 dark:border-brand/25 dark:bg-brand/15">
      <h4 className="mb-2 font-bold text-brand text-sm leading-tight tracking-tight">
        Summary of the changes
      </h4>
      <div>{children}</div>
    </div>
  )
}
