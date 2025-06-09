import { getTvsBreakdownForProject } from '~/server/features/scaling/tvs/breakdown/getTvsBreakdownForProject'
import { ps } from '~/server/projects'

export async function getScalingTvsProjectBreakdownApiData(slug: string) {
  const project = await ps.getProject({
    slug,
    select: ['tvsConfig'],
    optional: ['chainConfig', 'contracts'],
  })

  if (!project) {
    return { success: false, error: 'Project not found.' } as const
  }

  const data = await getTvsBreakdownForProject(project)
  return { success: true, data } as const
}
