import type { Project } from '@l2beat/config'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { RosetteValue } from '~/components/rosette/types'
import type { ProjectInteropData } from '~/server/features/layer2s/interop/getProjectInteropData'
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

  const throughputSection = await getDaThroughputSection(ethereum)

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
    },
  })

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
