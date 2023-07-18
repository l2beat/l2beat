import { hashJson } from '@l2beat/shared-pure'

import { getTotalSupplyConfigHash } from '../totalSupply/getTotalSupplyConfigHash'
import { TotalSupplyTokensConfig } from '../totalSupply/TotalSupplyTokensConfig'
import { ReportProject } from './ReportProject'

const EBV_LOGIC_VERSION = 0

export function getEBVConfigHash(
  project: ReportProject,
  tokens: TotalSupplyTokensConfig[],
) {
  return hashJson([
    extractProjectSkeleton(project),
    getTotalSupplyConfigHash(tokens).toString(),
    EBV_LOGIC_VERSION,
  ])
}

function extractProjectSkeleton(project: ReportProject) {
  const projectSkeleton: ReportProject = {
    ...project,
    escrows: [],
  }

  return {
    projectId: projectSkeleton.projectId.toString(),
    type: projectSkeleton.type,
  }
}
