import { pluralize } from '@l2beat/shared-pure'
import { useLocalStorage } from '~/hooks/useLocalStorage'
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

export interface HomeWhatsNewItem {
  id: string
  title: string
  description: string | undefined
  href: string
  imageSrc: string
  verticalImageSrc: string | undefined
  imageAlt: string
}

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

/**
 * The top of What's new: its title and the latest announcement. From lg it
 * takes the same two page rows as the domain cards' title and charts, so the
 * announcement starts with the chart labels and the line under it lands where
 * the line between the charts ends. The domain cards space those rows with a
 * 20px gap, half of which sits under their charts: the 10px bottom margin
 * here matches it.
 */
export function HomeWhatsNewHeadline({
  item,
  className,
}: {
  item: HomeWhatsNewItem | undefined
  className?: string
}) {
  return (
    <HomeCard
      className={cn(
        'flex flex-col gap-4',
        'lg:row-span-2 lg:mb-2.5 lg:grid lg:grid-rows-subgrid lg:gap-5 lg:border-b lg:pb-0',
        className,
      )}
    >
      <HomeCardHeader title="What's new" />
      {item && <Announcement item={item} />}
    </HomeCard>
  )
}

/**
 * New projects. From lg it takes the page row of the rankings beside it, so
 * the section after it starts on the same line that ends them. Its title
 * starts 10px down, level with theirs (the domain cards keep half their 20px
 * row gap above the rankings), and the headline above draws its top line.
 */
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
      className={cn('flex flex-col gap-2 lg:border-t-0 lg:pt-2.5', className)}
    >
      <HomeCardHeader title="New research" level={3} />
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

function Announcement({ item }: { item: HomeWhatsNewItem }) {
  // Opening the item counts as seeing it, which also retires the floating
  // what's new widget for it.
  const [, setSeen] = useLocalStorage(`whats-new-${item.id}`, false)
  return (
    <a
      href={item.href}
      onClick={() => setSeen(true)}
      // From lg it fills its row: the image takes whatever the text leaves.
      className="group flex flex-col gap-4 md:max-lg:flex-row md:max-lg:items-center md:max-lg:gap-5 lg:min-h-0 lg:pb-4"
    >
      <img
        src={item.imageSrc}
        alt={item.imageAlt}
        loading="lazy"
        className="aspect-video w-full rounded-md object-cover object-top-left md:max-lg:w-40 md:max-lg:shrink-0 lg:aspect-auto lg:h-0 lg:min-h-0 lg:flex-1 lg:basis-0"
      />
      <span className="flex min-w-0 flex-col gap-1">
        <span
          className={cn(
            'underline-offset-2 group-hover:underline',
            HOME_TEXT.row,
          )}
        >
          {item.title}
        </span>
        {item.description && (
          // The line height goes after the text size, which sets its own.
          <span className={cn(HOME_TEXT.meta, 'line-clamp-3 leading-normal')}>
            {item.description}
          </span>
        )}
      </span>
    </a>
  )
}

function NewProjects({ projects }: { projects: HomeRecentProject[] }) {
  return (
    // Row height and lines as in the rankings beside it, line included in
    // the 40px, so their rows and lines run level.
    <ul className="flex flex-col divide-y divide-divider">
      {projects.map((project) => (
        <li key={project.id} className="flex min-h-10">
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
