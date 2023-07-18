import { hashJson } from '@l2beat/shared-pure'

import { EBVToken } from '../assets'
import { ReportProject } from './ReportProject'

const EBV_LOGIC_VERSION = 0

export function getEBVConfigHash(project: ReportProject, tokens: EBVToken[]) {
  return hashJson([
    extractProjectSkeleton(project),
    extractEBVTokens(tokens),
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

function extractEBVTokens(tokens: EBVToken[]) {
  return tokens.map((t) => {
    return {
      assetId: t.assetId.toString(),
      tokenAddress: t.tokenAddress,
      sinceTimestamp: t.sinceTimestamp.toNumber(),
      decimals: t.decimals,
      premintHolderAddresses: t.premintHolderAddresses,
    }
  })
}
