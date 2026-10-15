import { getDb } from '~/server/database'
import { createProjectDataCheck } from '~/server/features/utils/createProjectDataCheck'
import { ps } from '~/server/projects'

export const checkIfActivityExists = createProjectDataCheck({
  name: 'checkIfActivityExists',
  getCandidates: async () => {
    const projects = await ps.getProjects({ where: ['activityConfig'] })
    return projects.map((p) => p.id)
  },
  getKeysWithData: (projectIds, fromInclusive) =>
    getDb().activity.getProjectIdsWithData(projectIds, fromInclusive),
})
