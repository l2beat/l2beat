import { Hash256, hashJson } from '@l2beat/shared-pure'

import { Project } from '../../../model'

const LIVENESS_LOGIC_VERSION = 0

export function getLivenessConfigHash(projects: Project[]): Hash256 {
  return hashJson([getEntries(projects), LIVENESS_LOGIC_VERSION])
}

// TODO: is JSON.stringify the best way to do this?
function getEntries(projects: Project[]) {
  return projects.map(({ projectId, livenessConfig }) => {
    return {
      projectId: projectId.toString(),
      transfers: JSON.stringify(livenessConfig?.transfers),
      functionCalls: JSON.stringify(livenessConfig?.functionCalls),
    }
  })
}
