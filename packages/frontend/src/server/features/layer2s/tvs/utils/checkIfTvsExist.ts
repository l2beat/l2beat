import { getDb } from '~/server/database'
import { createProjectDataCheck } from '~/server/features/utils/createProjectDataCheck'
import { ps } from '~/server/projects'

export const checkIfTvsExist = createProjectDataCheck({
  name: 'checkIfTvsExist',
  getCandidates: async () => {
    const projects = await ps.getProjects({ select: ['scalingInfo'] })
    return projects.map((p) => p.id)
  },
  getKeysWithData: (projectIds, fromInclusive) =>
    getDb().tvsTokenValue.getProjectIdsWithData(projectIds, fromInclusive),
})
