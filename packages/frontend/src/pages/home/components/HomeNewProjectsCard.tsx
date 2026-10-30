import { cn } from '~/utils/cn'
import type { HomeRecentProject } from '../getHomeData'
import {
  HOME_ICON_CLASS,
  HOME_ROW_CLASS,
  HOME_ROW_LINES_CLASS,
  HOME_ROW_LINK_CLASS,
  HOME_TEXT,
} from '../homeStyles'
import { HomeCard } from './HomeCard'
import { HomeCardHeader } from './HomeCardHeader'

/** New projects, under Ethereum beside the articles. */
export function HomeNewProjectsCard({
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
        'flex home-wide:min-h-0 recent-cols:min-h-0 flex-col gap-2',
        className,
      )}
    >
      <HomeCardHeader title="New research" />
      <NewProjects projects={projects} />
    </HomeCard>
  )
}

const STACKED_PROJECTS_COUNT = 5

function NewProjects({ projects }: { projects: HomeRecentProject[] }) {
  return (
    // Row height and lines as in the rankings. Beside the articles, or beside
    // interop in the page's three columns, the list takes the height they
    // leave (a 0px height, so it never sets it, but room for five) and shows
    // as many whole rows as fit. Stacked it shows five.
    <ul
      className={cn(
        'recent-cols:home-fill-rows home-wide:home-fill-rows flex home-wide:h-0 recent-cols:h-0 home-wide:min-h-[200px] recent-cols:min-h-[200px] home-wide:flex-1 recent-cols:flex-1 flex-col home-wide:overflow-hidden recent-cols:overflow-hidden',
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
              'home-wide:flex recent-cols:flex hidden',
          )}
        >
          <a
            href={project.href}
            title={project.name}
            className="group flex min-w-0 flex-1 items-center gap-2"
          >
            <img src={project.iconUrl} alt="" className={HOME_ICON_CLASS} />
            <span
              className={cn(
                'min-w-0 flex-1 truncate',
                HOME_ROW_LINK_CLASS,
                HOME_TEXT.row,
              )}
            >
              {project.name}
            </span>
            <span className={cn('shrink-0 pl-1', HOME_TEXT.meta)}>
              {project.label}
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
