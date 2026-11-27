import type { Project } from '@l2beat/config'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { RosetteValue } from '~/components/rosette/types'
import { env } from '~/env'
import {
  getLiquidStakingOverview,
  type LiquidStakingOverview,
} from '~/server/features/defi/liquid-staking/getLiquidStakingOverview'
import { getEthSupplyOverview } from '~/server/features/eth-supply/getEthSupplyOverview'
import { getLiveAvailability } from '~/server/features/layer2s/activity/live/getProjectLiveActivity'
import type { ProjectInteropData } from '~/server/features/layer2s/interop/getProjectInteropData'
import { getLogger } from '~/server/utils/logger'
import { getDiagramParams } from '~/utils/project/getDiagramParams'
import { toTechnologyRisk } from '~/utils/project/risk-summary/toTechnologyRisk'
import { toChartProject } from '~/utils/project/toChartProject'
import { optionToRange } from '~/utils/range/range'
import { getDaProjectRiskSummarySection } from './getDaProjectRiskSummarySection'
import { getDaThroughputSection } from './getDaThroughputSection'

export type EthereumProject = Project<
  'daLayer' | 'daBridge' | 'display' | 'statuses',
  'milestones' | 'contracts' | 'permissions'
>

export async function getEthereumProjectSections({
  ethereum,
  layerGrissiniValues,
  bridgeGrissiniValues,
  interopData,
}: {
  ethereum: EthereumProject
  layerGrissiniValues: RosetteValue[]
  bridgeGrissiniValues: RosetteValue[]
  interopData: ProjectInteropData | undefined
}) {
  const riskSummarySection = getDaProjectRiskSummarySection(
    ethereum,
    ethereum,
    true,
  )

  const items: ProjectDetailsSection[] = []

  const [throughputSection, liquidStaking, ethSupply] = await Promise.all([
    getDaThroughputSection(ethereum),
    getLiquidStaking(),
    getEthSupply(),
  ])

  if (interopData) {
    items.push({
      type: 'InteropFlowsSection',
      props: {
        id: 'interop-flows',
        title: 'Volume and flows',
        interopChains: interopData.interopChains,
        protocols: interopData.protocols,
        defaultSelectedChains: interopData.defaultSelectedChains,
        defaultStatsChainId: interopData.chainId,
      },
    })
  }

  if (throughputSection) {
    items.push({
      type: 'ThroughputSection',
      props: {
        id: 'throughput',
        title: 'Throughput',
        ...throughputSection,
      },
    })
  }

  items.push({
    type: 'ActivitySection',
    props: {
      id: 'activity',
      title: 'Activity',
      dataSource: undefined,
      defaultRange: optionToRange('1y'),
      project: toChartProject(ethereum),
      milestones: ethereum.milestones ?? [],
      live: await getLiveAvailability(ethereum.id),
    },
  })

  // Economics folds in the liquid staking table, so it replaces that section.
  if (ethSupply) {
    items.push({
      type: 'EconomicsSection',
      props: {
        id: 'economics',
        title: 'Economics',
        ethSupply,
        liquidStaking,
      },
    })
  } else if (liquidStaking) {
    items.push({
      type: 'LiquidStakingSection',
      props: {
        id: 'liquid-staking',
        title: 'Liquid staking',
        ...liquidStaking,
      },
    })
  }

  if (
    riskSummarySection.layer.risks.concat(riskSummarySection.bridge.risks)
      .length > 0
  ) {
    items.push({
      type: 'DaRiskSummarySection',
      props: {
        id: 'risk-summary',
        title: 'Risk summary',
        ...riskSummarySection,
      },
    })
  }

  items.push({
    type: 'GrissiniRiskAnalysisSection',
    props: {
      id: 'da-layer-risk-analysis',
      title: 'Risk analysis',
      isUnderReview: !!ethereum.statuses.reviewStatus,
      isVerified: true,
      layerGrissiniValues,
      bridgeGrissiniValues,
      description: ethereum.display.description,
    },
  })

  items.push({
    type: 'MarkdownSection',
    props: {
      id: 'da-layer-technology',
      title: 'Technology',
      diagram: getDiagramParams('da-layer-technology', ethereum.slug),
      content: ethereum.daLayer.technology.description.concat(
        '\n\n',
        ethereum.daBridge.technology.description,
      ),
      mdClassName: 'da-beat',
      risks: ethereum.daLayer.technology.risks?.map(toTechnologyRisk),
      references: ethereum.daLayer.technology.references?.concat(
        ...(ethereum.daBridge.technology.references ?? []),
      ),
    },
  })

  return items
}

async function getLiquidStaking(): Promise<LiquidStakingOverview | undefined> {
  // Its links lead to DeFi pages, so it follows their flag.
  if (!env.CLIENT_SIDE_DEFI_ENABLED) return undefined
  const overview = await getLiquidStakingOverview()
  return overview.entries.length > 0 ? overview : undefined
}

/** The page stays useful without its economics, so a failed read only hides them. */
async function getEthSupply() {
  if (!env.CLIENT_SIDE_ETH_ECONOMICS_ENABLED) return undefined
  try {
    return await getEthSupplyOverview()
  } catch (error) {
    getLogger()
      .for('getEthereumProjectSections')
      .error('ETH supply unavailable', { error })
    return undefined
  }
}
