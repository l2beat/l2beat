import { Project } from '@l2beat/config'

import { L2Data } from '../../../L2Data'
import { formatUSD } from '../../../utils'
import { LinkSectionProps } from '../view/links/LinkSection'

export function getLinkSection(
  project: Project,
  l2Data: L2Data
): LinkSectionProps {
  const experimental = l2Data.experimental[project.name]

  const tokens = project.bridges
    .flatMap((x) => x.tokens)
    .filter((x, i, a) => a.indexOf(x) === i)

  const showNoEth = tokens.includes('ETH')
  const showInflowsOutflows = tokens.length !== 1 || tokens[0] !== 'ETH'

  const stats: LinkSectionProps['experimentalStats7d'] = {
    visible: true,
    showExcludingEth: showNoEth,
    inflows: showInflowsOutflows
      ? formatUSD(experimental.usdIn7DayNoEth)
      : undefined,
    outflows: showInflowsOutflows
      ? formatUSD(experimental.usdOut7DayNoEth)
      : undefined,
    batchCount: experimental.batchCount7d,
    transactionCount: experimental.messageCount7d,
  }

  stats.visible =
    stats.inflows !== undefined ||
    stats.outflows !== undefined ||
    stats.batchCount !== undefined ||
    stats.transactionCount !== undefined

  return {
    links: project.details.links,
    name: project.name,
    icon: `/icons/${project.slug}.png`,
    experimentalStats7d: stats,
  }
}
