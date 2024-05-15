import { Bridge } from '@l2beat/config'
import {
  ImplementationChangeReportApiResponse,
  ManuallyVerifiedContracts,
  VerificationStatus,
} from '@l2beat/shared-pure'
import isEmpty from 'lodash/isEmpty'

import { ProjectDetailsCharts } from '../../common/getCharts'
import { getContractSection } from '../../common/getContractSection'
import { getPermissionsSection } from '../../common/getPermissionsSection'
import { ProjectDetailsSection } from '../../components/sections/types'
import { getRiskSection } from './getRiskSection'
import { getTechnologyOverview } from './getTechnologyOverview'

export function getProjectDetails(
  bridge: Bridge,
  verificationStatus: VerificationStatus,
  manuallyVerifiedContracts: ManuallyVerifiedContracts,
  implementationChange: ImplementationChangeReportApiResponse | undefined,
  charts: ProjectDetailsCharts,
) {
  const technologySections = getTechnologyOverview(bridge)
  const permissionsSection = getPermissionsSection(
    bridge,
    verificationStatus,
    manuallyVerifiedContracts,
  )
  const riskSection = getRiskSection(bridge, verificationStatus)

  const items: ProjectDetailsSection[] = []

  if (charts.tvl) {
    items.push({
      type: 'ChartSection',
      props: {
        ...charts.tvl,
        id: 'tvl',
        title: 'Value Locked',
      },
    })
  }

  if (charts.activity) {
    items.push({
      type: 'ChartSection',
      props: {
        ...charts.activity,
        id: 'activity',
        title: 'Activity',
      },
    })
  }

  if (charts.costs) {
    items.push({
      type: 'ChartSection',
      props: {
        ...charts.costs,
        id: 'onchain-costs',
        title: 'Onchain costs',
      },
    })
  }

  if (bridge.milestones && !isEmpty(bridge.milestones)) {
    items.push({
      type: 'MilestonesSection',
      props: {
        milestones: bridge.milestones,
        id: 'milestones',
        title: 'Milestones',
      },
    })
  }

  if (bridge.display.detailedDescription) {
    items.push({
      type: 'DetailedDescriptionSection',
      props: {
        id: 'detailed-description',
        title: 'Detailed description',
        description: bridge.display.description,
        detailedDescription: bridge.display.detailedDescription,
      },
    })
  }

  if (riskSection.riskGroups.length > 0) {
    items.push({
      type: 'RiskSection',
      props: riskSection,
    })
  }

  technologySections.forEach((section) =>
    items.push({
      type: 'TechnologySection',
      props: {
        items: section.items,
        id: section.id,
        title: section.title,
      },
    }),
  )

  if (permissionsSection) {
    items.push({
      type: 'PermissionsSection',
      props: {
        ...permissionsSection,
        id: 'permissions',
        title: 'Permissions',
      },
    })
  }

  if (bridge.contracts?.addresses && bridge.contracts.addresses.length > 0)
    items.push({
      type: 'ContractsSection',
      props: getContractSection(
        bridge,
        verificationStatus,
        manuallyVerifiedContracts,
        implementationChange,
      ),
    })

  if (bridge.knowledgeNuggets && !isEmpty(bridge.knowledgeNuggets)) {
    items.push({
      type: 'KnowledgeNuggetsSection',
      props: {
        knowledgeNuggets: bridge.knowledgeNuggets,
        id: 'knowledge-nuggets',
        title: 'Knowledge Nuggets',
      },
    })
  }

  return items
}
