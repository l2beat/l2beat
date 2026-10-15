import { getDb } from '~/server/database'
import { createProjectDataCheck } from '~/server/features/utils/createProjectDataCheck'
import { ps } from '~/server/projects'

export const checkIfDataPostedExists = createProjectDataCheck({
  name: 'checkIfDataPostedExists',
  getCandidates: async () => {
    const projects = await ps.getProjects({ where: ['daTrackingConfig'] })
    return projects.map((p) => p.id)
  },
  getKeysWithData: (projectIds, fromInclusive) =>
    getDb().dataAvailability.getProjectIdsWithData(projectIds, fromInclusive),
})
