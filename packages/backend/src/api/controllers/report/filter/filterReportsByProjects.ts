import { EthereumAddress } from '@l2beat/common'

import { ProjectInfo } from '../../../../model/ProjectInfo'
import { ReportWithBalance } from '../../../../peripherals/database/ReportRepository'

export function filterReportsByProjects(
  reports: ReportWithBalance[],
  projects: ProjectInfo[]
): ReportWithBalance[] {
  const bridges = getBridges(projects)
  return reports.filter((report) => {
    const bridge = bridges.get(report.bridge)
    if (!bridge || bridge.sinceBlock > report.blockNumber) {
      return false
    }
    const tokenSinceBlock = bridge.tokens.get(report.asset)
    if (tokenSinceBlock === undefined || tokenSinceBlock > report.blockNumber) {
      return false
    }
    return true
  })
}

function getBridges(projects: ProjectInfo[]) {
  return new Map(
    projects.flatMap((p) =>
      p.bridges.map((b) => [
        EthereumAddress(b.address),
        {
          sinceBlock: b.sinceBlock,
          tokens: new Map(b.tokens.map((t) => [t.id, t.sinceBlock])),
        },
      ])
    )
  )
}
