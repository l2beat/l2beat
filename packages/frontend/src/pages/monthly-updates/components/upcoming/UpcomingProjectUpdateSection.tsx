import type { UpcomingProjectUpdateEntry } from '~/server/features/monthly-reports/getUpcomingEntries'
import { News } from '../News'
import { ProjectUpdateSection } from '../ProjectUpdateSection'

interface Props {
  upcomingProject: UpcomingProjectUpdateEntry
}

export function UpcomingProjectUpdateSection({ upcomingProject }: Props) {
  return (
    <ProjectUpdateSection
      name={upcomingProject.name}
      bannerImg={upcomingProject.bannerImg}
    >
      <News news={upcomingProject.news} />
    </ProjectUpdateSection>
  )
}
