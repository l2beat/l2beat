import { pluralize } from '@l2beat/shared-pure'
import { cn } from '~/utils/cn'
import { formatPublicationDate } from '~/utils/dates'
import type { HomeRecentProject } from '../getHomeData'
import type { HomeResearchItem } from '../getHomeResearch'
import {
  HOME_BANNER_CLASS,
  HOME_BANNER_TITLE_CLASS,
  HOME_ICON_CLASS,
  HOME_ROW_CLASS,
  HOME_ROW_LINES_CLASS,
  HOME_TEXT,
  HOME_THUMBNAIL_CLASS,
} from '../homeStyles'
import { HomeCard } from './HomeCard'
import { HomeCardHeader } from './HomeCardHeader'
import { HomeStackedIcons } from './HomeStackedIcons'
import { RecentChangesDialog } from './RecentChangesDialog'

export interface HomeRecentChangesProject {
  name: string
  iconUrl: string
}

const CATEGORY_LABEL: Record<HomeRecentProject['category'], string> = {
  l2: 'Scaling project',
  interop: 'Interoperability',
  zkCatalog: 'ZK Catalog',
  ecosystems: 'Ecosystem',
  privacy: 'Privacy',
}

/** New projects, under Ethereum beside the articles. */
export function HomeWhatsNewProjects({
  projects,
  className,
}: {
  projects: HomeRecentProject[]
  className?: string
}) {
  if (projects.length === 0) {
    return null
  }
  return (
    <HomeCard
      className={cn(
        'flex @min-[560px]/recent:min-h-0 flex-col gap-2',
        className,
      )}
    >
      <HomeCardHeader title="New research" />
      <NewProjects projects={projects} />
    </HomeCard>
  )
}

/**
 * Project changes of the last 7 days, as a banner like the garden and the
 * mandate, with a diff in the corner: the whole card opens the list of them,
 * its icons a glimpse of which projects changed.
 */
export function HomeProjectChangesSection({
  count,
  projects,
  className,
}: {
  count: number
  projects: HomeRecentChangesProject[]
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
        <p className={cn('max-w-[62%]', HOME_TEXT.body)}>
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
          className={cn(HOME_BANNER_CLASS, 'w-full text-left', className)}
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

/** Our latest research, as on the Research tab of /publications. */
export function HomeLatestArticlesSection({
  research,
  className,
}: {
  research: HomeResearchItem[]
  className?: string
}) {
  return (
    <HomeCard className={cn('flex flex-col gap-3', className)}>
      <HomeCardHeader
        title="Latest articles"
        link={{ href: '/publications', label: 'All publications' }}
      />
      <Research items={research} />
    </HomeCard>
  )
}

const STACKED_PROJECTS_COUNT = 5

function NewProjects({ projects }: { projects: HomeRecentProject[] }) {
  return (
    // Row height and lines as in the rankings. Beside the articles the list
    // takes the height they leave (a 0px height, so it never sets it, but
    // room for five) and shows as many whole rows as fit. Stacked it shows
    // five.
    <ul
      className={cn(
        '@min-[560px]/recent:home-fill-rows flex @min-[560px]/recent:h-0 @min-[560px]/recent:min-h-[200px] @min-[560px]/recent:flex-1 flex-col @min-[560px]/recent:overflow-hidden',
        HOME_ROW_LINES_CLASS,
      )}
    >
      {projects.map((project, index) => (
        <li
          key={project.id}
          className={cn(
            'flex w-full shrink-0',
            HOME_ROW_CLASS,
            index >= STACKED_PROJECTS_COUNT &&
              '@min-[560px]/recent:flex hidden',
          )}
        >
          <a
            href={project.href}
            className="group flex min-w-0 flex-1 items-center gap-2"
          >
            <img src={project.iconUrl} alt="" className={HOME_ICON_CLASS} />
            <span
              className={cn(
                'min-w-0 flex-1 truncate underline-offset-2 group-hover:underline',
                HOME_TEXT.row,
              )}
            >
              {project.name}
            </span>
            <span className={cn('shrink-0', HOME_TEXT.meta)}>
              {project.category === 'l2' && project.l2Category
                ? project.l2Category
                : CATEGORY_LABEL[project.category]}
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}

function Research({ items }: { items: HomeResearchItem[] }) {
  if (items.length === 0) {
    return null
  }
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => {
        const isExternal = !item.url.startsWith('/')
        return (
          <li key={item.id}>
            <a
              href={item.url}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noreferrer noopener' : undefined}
              className="group flex items-center gap-3"
            >
              <img
                src={item.thumbnail.src}
                alt=""
                loading="lazy"
                className={HOME_THUMBNAIL_CLASS}
              />
              <span className="flex min-w-0 flex-col gap-0.5">
                <span
                  className={cn(
                    'line-clamp-2 underline-offset-2 group-hover:underline',
                    HOME_TEXT.row,
                  )}
                >
                  {item.shortTitle ?? item.title}
                </span>
                <span className={HOME_TEXT.meta}>
                  {formatPublicationDate(new Date(item.publishedOn * 1000))}
                </span>
              </span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
