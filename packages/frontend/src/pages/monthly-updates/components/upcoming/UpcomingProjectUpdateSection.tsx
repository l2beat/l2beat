import type { UpcomingProjectUpdateEntry } from '~/server/features/monthly-reports/getUpcomingEntries'
import { News } from '../News'

interface Props {
  upcomingProject: UpcomingProjectUpdateEntry
}

export function UpcomingProjectUpdateSection({ upcomingProject }: Props) {
  return (
    <div id={upcomingProject.name} className="mt-12">
      <img
        src={upcomingProject.bannerImg}
        className="min-h-[60px] w-full rounded-lg object-cover"
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2"></div>
      {upcomingProject.news && upcomingProject.news?.length > 0 && (
        <News news={upcomingProject.news} />
      )}
    </div>
  )
}
