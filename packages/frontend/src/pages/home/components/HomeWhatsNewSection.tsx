import { pluralize } from '@l2beat/shared-pure'
import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'
import { formatPublicationDate } from '~/utils/dates'
import type { HomeRecentProject } from '../getHomeData'
import type { HomeResearchItem } from '../getHomeResearch'
import {
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
 * Project changes of the last 7 days: the whole card opens the list of them,
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
  const title = (
    <span className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
      <h2 className={cn(HOME_TEXT.title, HOME_BANNER_TITLE_CLASS)}>
        Project changes
      </h2>
      <span className={HOME_TEXT.subtitle}>Last 7 days</span>
    </span>
  )
  if (count === 0) {
    return (
      <HomeCard
        className={cn('flex items-center justify-between gap-3', className)}
      >
        {title}
        <span className={HOME_TEXT.meta}>None this week</span>
      </HomeCard>
    )
  }
  const rest = projects.length - CHANGED_PROJECT_ICONS
  return (
    <RecentChangesDialog
      trigger={
        <HomeCard
          asChild
          className={cn(
            'group flex w-full items-center gap-3 text-left',
            className,
          )}
        >
          <button type="button">
            {title}
            <span className="sr-only">
              {count} {pluralize(count, 'change')} in {projects.length}{' '}
              {pluralize(projects.length, 'project')}
            </span>
            <span className="ml-auto flex shrink-0 items-center gap-1.5">
              <HomeStackedIcons
                items={projects}
                max={CHANGED_PROJECT_ICONS}
                className="size-6"
              />
              {rest > 0 && (
                <span className="font-semibold text-label-value-15 tabular-nums">
                  +{rest}
                </span>
              )}
            </span>
            <ChevronIcon className="-rotate-90 size-2.5 shrink-0 fill-secondary transition-colors group-hover:fill-primary" />
          </button>
        </HomeCard>
      }
    />
  )
}

const CHANGED_PROJECT_ICONS = 3

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
              <span className="flex min-w-0 flex-col">
                {/* Room between the lines when a title takes two. */}
                <span
                  className={cn(
                    'line-clamp-2 underline-offset-2 group-hover:underline',
                    HOME_TEXT.row,
                    'leading-5',
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
