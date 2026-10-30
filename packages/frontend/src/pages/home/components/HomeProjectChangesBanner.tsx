import { pluralize } from '@l2beat/shared-pure'
import { cn } from '~/utils/cn'
import {
  HOME_BANNER_CLASS,
  HOME_BANNER_TITLE_CLASS,
  HOME_TEXT,
} from '../homeStyles'
import { HomeCard } from './HomeCard'
import { type HomeStackedIcon, HomeStackedIcons } from './HomeStackedIcons'
import { RecentChangesDialog } from './RecentChangesDialog'

/**
 * Project changes of the last 7 days, as a banner like the garden and the
 * mandate, with a diff in the corner: the whole card opens the list of them,
 * its icons a glimpse of which projects changed.
 */
export function HomeProjectChangesBanner({
  count,
  projects,
  className,
}: {
  count: number
  projects: HomeStackedIcon[]
  className?: string
}) {
  const content = (
    <>
      {/* Lifts toward the reader on hover, like the mandate. */}
      <ChangesSheet className="-bottom-6 group-hover:-translate-y-1.5 pointer-events-none absolute right-1 w-24 rotate-[6deg] transition-[rotate,translate] duration-300 ease-out group-hover:rotate-[3deg] lg:w-28" />
      <div className="relative flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2
            className={cn(
              HOME_TEXT.title,
              count > 0 && HOME_BANNER_TITLE_CLASS,
            )}
          >
            Project changes
          </h2>
          {count > 0 && (
            <span className="flex items-center gap-2">
              <HomeStackedIcons items={projects} max={CHANGED_PROJECT_ICONS} />
              <span className={HOME_TEXT.meta}>
                {projects.length} {pluralize(projects.length, 'project')}
              </span>
            </span>
          )}
        </div>
        {/* Balanced: in this narrow column a pretty wrap can still leave one
            word on the second line. */}
        <p className={cn('max-w-[62%]', HOME_TEXT.body, 'text-balance')}>
          {count > 0
            ? `${count} ${pluralize(count, 'change')} handled in the last 7 days.`
            : 'None handled in the last 7 days.'}
        </p>
      </div>
    </>
  )
  if (count === 0) {
    return (
      <HomeCard className={cn(HOME_BANNER_CLASS, className)}>
        {content}
      </HomeCard>
    )
  }
  return (
    <RecentChangesDialog
      trigger={
        <HomeCard
          asChild
          // A button centres its content when stretched; start it at the
          // top like the other banners in its row.
          className={cn(
            HOME_BANNER_CLASS,
            'flex w-full flex-col justify-start text-left',
            className,
          )}
        >
          <button type="button">{content}</button>
        </HomeCard>
      }
    />
  )
}

const CHANGED_PROJECT_ICONS = 3

/** The sheet's rows: [y, width, kind], as in a diff. */
const DIFF_LINES = [
  [48, 74, 'same'],
  [64, 96, 'removed'],
  [80, 82, 'removed'],
  [96, 104, 'added'],
  [112, 88, 'added'],
  [128, 66, 'same'],
  [144, 92, 'same'],
] as const

const DIFF_CLASSES = {
  same: { row: '', line: 'fill-surface-tertiary' },
  removed: { row: 'fill-negative/12', line: 'fill-negative/55' },
  added: { row: 'fill-positive/12', line: 'fill-positive/55' },
}

/** A file changed: two lines out, two lines in. */
function ChangesSheet({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 170"
      aria-hidden
      className={cn('overflow-visible', className)}
    >
      <rect
        x="26"
        y="14"
        width="140"
        height="164"
        rx="8"
        className="fill-surface-secondary"
      />
      {/* The file's name. */}
      <path
        d="M26 22a8 8 0 0 1 8-8h124a8 8 0 0 1 8 8v14H26z"
        className="fill-surface-tertiary"
      />
      <rect
        x="38"
        y="22.5"
        width="48"
        height="5"
        rx="2.5"
        className="fill-surface-secondary"
      />
      {DIFF_LINES.map(([y, width, kind]) => (
        <g key={y}>
          {kind !== 'same' && (
            <>
              <rect
                x="26"
                y={y - 5}
                width="140"
                height="15"
                className={DIFF_CLASSES[kind].row}
              />
              <rect
                x="35"
                y={y + 1.25}
                width="7"
                height="2.5"
                rx="1.25"
                className={DIFF_CLASSES[kind].line}
              />
            </>
          )}
          {kind === 'added' && (
            <rect
              x="37.25"
              y={y - 1}
              width="2.5"
              height="7"
              rx="1.25"
              className={DIFF_CLASSES[kind].line}
            />
          )}
          <rect
            x="50"
            y={y}
            width={width}
            height="5"
            rx="2.5"
            className={DIFF_CLASSES[kind].line}
          />
        </g>
      ))}
    </svg>
  )
}
