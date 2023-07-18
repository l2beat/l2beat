import { hashJson } from '@l2beat/shared-pure'

import { getTotalSupplyConfigHash } from '../totalSupply/getTotalSupplyConfigHash'
import { TotalSupplyTokensConfig } from '../totalSupply/TotalSupplyTokensConfig'
import { getReportConfigHash } from './getReportConfigHash'
import { ReportProject } from './ReportProject'

const EBV_LOGIC_VERSION = 0

export function getEBVConfigHash(
  project: ReportProject[],
  tokens: TotalSupplyTokensConfig[],
) {
  return hashJson([
    getReportConfigHash(project).toString(),
    getTotalSupplyConfigHash(tokens).toString(),
    EBV_LOGIC_VERSION,
  ])
}
