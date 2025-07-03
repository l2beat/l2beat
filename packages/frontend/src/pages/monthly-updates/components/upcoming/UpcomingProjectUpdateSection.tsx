import type { UpcomingProjectUpdate } from '~/content/monthly-updates'
import { News } from '../News'

interface Props {
  upcomingProject: UpcomingProjectUpdate
}

export function UpcomingProjectUpdateSection({ upcomingProject }: Props) {
  return (
    <div id={upcomingProject.name} className="mt-12">
      <img
        src={`/images/monthly-updates/${upcomingProject.projectId}.png`}
        className="min-h-[60px] w-full rounded-lg object-cover"
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2"></div>
      {upcomingProject.news && upcomingProject.news?.length > 0 && (
        <News news={upcomingProject.news} />
      )}
    </div>
  )
}
