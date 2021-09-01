import { Project } from '@l2beat/config'

import { L2Data } from '../../../L2Data'
import { formatUSD } from '../../../utils'
import { LinkSectionProps } from '../view/links/LinkSection'

export function getLinkSection(
  project: Project,
  l2Data: L2Data
): LinkSectionProps {
  const experimental = l2Data.experimental[project.name]
  return {
    links: project.details.links,
    name: project.name,
    icon: `/icons/${project.slug}.png`,
    experimentalStats7d: {
      inflowsNoEth: formatUSD(experimental.usdIn7DayNoEth),
      outflowsNoEth: formatUSD(experimental.usdOut7DayNoEth),
      batchCount: experimental.batchCount7d,
      transactionCount: experimental.messageCount7d,
    },
  }
}
