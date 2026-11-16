import type { HomeRecentProject } from '../getHomeData'
import type { HomeResearchItem } from '../getHomeResearch'
import { HomeLatestArticlesCard } from './HomeLatestArticlesCard'
import { HomeNewProjectsCard } from './HomeNewProjectsCard'
import { HomeProjectChangesBanner } from './HomeProjectChangesBanner'
import type { HomeStackedIcon } from './HomeStackedIcons'

/**
 * Under Ethereum: two columns once wide enough (`recent-cols`), articles over
 * project changes, and new research filling the other column with as many
 * rows as fit. Stacked, the columns dissolve and project changes comes last.
 * In the page's three columns (`home-wide`) all of it dissolves and each card
 * takes its own area.
 */
export function HomeRecentColumn({
  research,
  recentChanges,
  recentProjects,
}: {
  research: HomeResearchItem[]
  recentChanges: { count: number; projects: HomeStackedIcon[] }
  recentProjects: HomeRecentProject[]
}) {
  return (
    <div className="@container/recent flex home-wide:contents min-w-0 flex-1 flex-col max-lg:order-last">
      <div className="flex recent-cols:grid home-wide:contents min-w-0 flex-1 recent-cols:grid-cols-2 flex-col md:gap-4">
        <div className="recent-cols:flex contents recent-cols:min-w-0 recent-cols:flex-col recent-cols:gap-4">
          <HomeLatestArticlesCard
            research={research}
            className="recent-cols:flex-1 home-wide:[grid-area:articles]"
          />
          <HomeProjectChangesBanner
            count={recentChanges.count}
            projects={recentChanges.projects}
            className="order-last recent-cols:order-none home-wide:[grid-area:changes]"
          />
        </div>
        <HomeNewProjectsCard
          projects={recentProjects}
          className="recent-cols:min-w-0 recent-cols:flex-1 home-wide:[grid-area:research]"
        />
      </div>
    </div>
  )
}
