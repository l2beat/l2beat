import { getProjectTokensEntries } from '~/server/features/scaling/tvs/breakdown/getProjectTokensEntries'
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

  const data = await getProjectTokensEntries(project)
  return { success: true, data } as const
}
