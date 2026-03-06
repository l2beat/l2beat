import type { ScalingSummaryEntry } from '~/server/features/scaling/summary/getScalingSummaryEntries'

interface Props {
  entries: ScalingSummaryEntry[]
}

function getProjectType(entry: ScalingSummaryEntry): string | undefined {
  return entry.filterable?.find((f) => f.id === 'type')?.value
}

export function BadgeModalProjectsList({ entries }: Props) {
  return (
    <div className="grid grid-cols-3 gap-1 pt-1">
      {entries.map((entry) => {
        const type = getProjectType(entry)
        return (
          <a
            key={entry.id.toString()}
            href={`/scaling/projects/${entry.slug}`}
            className="flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-center transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
          >
            <img
              src={entry.icon}
              alt={`${entry.name} logo`}
              width={40}
              height={40}
              className="size-10 rounded-md"
            />
            <span className="w-full truncate font-semibold text-sm leading-tight">
              {entry.shortName ?? entry.name}
            </span>
            {type && (
              <span className="rounded-full border border-black/10 bg-black/[0.04] px-2 py-0.5 text-3xs font-medium text-primary/70 dark:border-white/10 dark:bg-white/[0.08] dark:text-primary/80">
                {type}
              </span>
            )}
          </a>
        )
      })}
    </div>
  )
}
