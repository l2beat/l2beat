import { env } from '~/env'
import { ps } from '~/server/projects'

export async function getActivityProjects() {
  const projects = await ps.getProjects({
    select: ['scalingInfo', 'statuses'],
    where: ['activityConfig'],
    whereNot: ['isUpcoming'],
  })
  return projects.filter((p) => !env.EXCLUDED_ACTIVITY_PROJECTS?.includes(p.id))
}
