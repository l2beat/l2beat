import { pluralize } from '@l2beat/shared-pure'
import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'
import { formatPublicationDate } from '~/utils/dates'
import type { HomeRecentProject } from '../getHomeData'
import type { HomeResearchItem } from '../getHomeResearch'
import { HOME_ICON_CLASS, HOME_TEXT, HOME_THUMBNAIL_CLASS } from '../homeStyles'
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
  da: 'Data Availability',
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

/** Project changes of the last 7 days; opens the list of them. */
export function HomeProjectChangesSection({
  count,
  projects,
  className,
}: {
  count: number
  projects: HomeRecentChangesProject[]
  className?: string
}) {
  return (
    <HomeCard className={cn('flex flex-col gap-3', className)}>
      <HomeCardHeader title="Project changes" subtitle="Last 7 days" />
      <ProjectChanges count={count} projects={projects} />
    </HomeCard>
  )
}

/** Our research: native rollups first, then the latest publications. */
export function HomeLatestArticlesSection({
  research,
  className,
}: {
  research: HomeResearchItem[]
  className?: string
}) {
  return (
    <HomeCard className={cn('flex flex-col gap-3', className)}>
      <HomeCardHeader title="Latest articles" href="/publications" />
      <Research items={research} />
    </HomeCard>
  )
}

const STACKED_PROJECTS_COUNT = 5

function NewProjects({ projects }: { projects: HomeRecentProject[] }) {
  return (
    // Row height and lines as in the rankings. Beside the articles the list
    // takes the height they leave (a 0px height, so it never sets it, but
    // room for five), wrapping the rows that do not fit into a second column,
    // out of view: whole rows only. Stacked it shows five.
    <ul className="flex @min-[560px]/recent:h-0 @min-[560px]/recent:min-h-[200px] @min-[560px]/recent:flex-1 flex-col @min-[560px]/recent:flex-wrap divide-y divide-divider @min-[560px]/recent:overflow-hidden">
      {projects.map((project, index) => (
        <li
          key={project.id}
          className={cn(
            'flex @min-[560px]/recent:h-10 min-h-10 w-full shrink-0',
            index >= STACKED_PROJECTS_COUNT &&
              '@min-[560px]/recent:flex hidden',
          )}
        >
          <a
            href={project.href}
            className="group flex min-w-0 flex-1 items-center gap-2 py-2"
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

function ProjectChanges({
  count,
  projects,
}: {
  count: number
  projects: HomeRecentChangesProject[]
}) {
  if (count === 0) {
    return <span className={HOME_TEXT.meta}>No changes this week</span>
  }
  return (
    <RecentChangesDialog
      trigger={
        <button
          type="button"
          className="group flex w-fit items-center gap-2 text-left"
        >
          <HomeStackedIcons items={projects} max={4} showRest={false} />
          <span
            className={cn(
              'underline-offset-2 group-hover:underline',
              HOME_TEXT.row,
            )}
          >
            {count} {pluralize(count, 'change')}
          </span>
          <ChevronIcon className="-rotate-90 size-2.5 shrink-0 fill-secondary transition-[fill,translate] group-hover:translate-x-0.5 group-hover:fill-link" />
        </button>
      }
    />
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
