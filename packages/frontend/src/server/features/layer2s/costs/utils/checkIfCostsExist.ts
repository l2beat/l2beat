import { getDb } from '~/server/database'
import { createProjectDataCheck } from '~/server/features/utils/createProjectDataCheck'
import { ps } from '~/server/projects'

export const checkIfCostsExist = createProjectDataCheck({
  name: 'checkIfCostsExist',
  getCandidates: async () => {
    const projects = await ps.getProjects({ where: ['costsInfo'] })
    return projects.map((p) => p.id)
  },
  getKeysWithData: (projectIds, fromInclusive) =>
    getDb().aggregatedL2Cost.getProjectIdsWithData(projectIds, fromInclusive),
})
