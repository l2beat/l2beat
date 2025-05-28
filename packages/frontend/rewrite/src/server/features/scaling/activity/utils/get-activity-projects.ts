import { ps } from 'rewrite/src/server/projects'
import { env } from '~/env'

export async function getActivityProjects() {
  const projects = await ps.getProjects({
    select: ['scalingInfo', 'statuses'],
    where: ['activityConfig'],
    whereNot: ['isUpcoming'],
  })
  return projects.filter((p) => !env.EXCLUDED_ACTIVITY_PROJECTS?.includes(p.id))
}
