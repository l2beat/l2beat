import { ps } from '~/server/projects'

/** Projects the relations graph needs for chain display and bridge names. */
export function getRelationsGraphProjects() {
  return Promise.all([
    ps.getProjects({ select: ['chainConfig'] }),
    ps.getProjects({ select: ['interopConfig'] }),
  ])
}
