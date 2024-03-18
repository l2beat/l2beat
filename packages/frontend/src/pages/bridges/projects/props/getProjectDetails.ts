import { Bridge } from '@l2beat/config'
import {
  DiffStateApiResponse,
  ManuallyVerifiedContracts,
  VerificationStatus,
} from '@l2beat/shared-pure'
import isEmpty from 'lodash/isEmpty'

import { ChartProps } from '../../../../components'
import { getContractSection } from '../../../../utils/project/getContractSection'
import { getPermissionsSection } from '../../../../utils/project/getPermissionsSection'
import {
  getProjectEditLink,
  getProjectIssueLink,
} from '../../../../utils/project/links'
import {
  ProjectDetailsChartSection,
  ProjectDetailsContractsSection,
  ProjectDetailsDetailedDescriptionSection,
  ProjectDetailsKnowledgeNuggetsSection,
  ProjectDetailsMilestonesSection,
  ProjectDetailsPermissionsSection,
  ProjectDetailsRiskSection,
  ProjectDetailsTechnologyIncompleteNote,
  ProjectDetailsTechnologySection,
} from '../../../types'
import { getRiskSection } from './getRiskSection'
import { getTechnologyOverview } from './getTechnologyOverview'

export function getProjectDetails(
  bridge: Bridge,
  verificationStatus: VerificationStatus,
  manuallyVerifiedContracts: ManuallyVerifiedContracts,
  diffState: DiffStateApiResponse | undefined,
  chart: ChartProps,
) {
  const { incomplete, sections: technologySections } =
    getTechnologyOverview(bridge)
  const permissionsSection = getPermissionsSection(
    bridge,
    verificationStatus,
    manuallyVerifiedContracts,
  )

  const items: BridgeDetailsItem[] = []
  items.push({
    type: 'ChartSection',
    props: {
      ...chart,
      id: 'chart',
      title: 'Chart',
    },
  })
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

  const riskSection = getRiskSection(bridge, verificationStatus)
  if (riskSection.riskGroups.length > 0) {
    items.push({
      type: 'RiskSection',
      props: riskSection,
    })
  }

  if (incomplete) {
    items.push({
      type: 'TechnologyIncompleteNote',
      excludeFromNavigation: true,
      props: incomplete,
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

  if (bridge.contracts)
    items.push({
      type: 'ContractsSection',
      props: getContractSection(
        bridge,
        verificationStatus,
        manuallyVerifiedContracts,
        diffState,
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

  return {
    items,
    editLink: getProjectEditLink(bridge),
    issueLink: getProjectIssueLink(bridge),
    incomplete,
  }
}

export type BridgeDetailsItem = { excludeFromNavigation?: boolean } & (
  | BridgeDetailsSection
  | NonSectionElement
)

export type BridgeDetailsSection =
  | ProjectDetailsChartSection
  | ProjectDetailsDetailedDescriptionSection
  | ProjectDetailsMilestonesSection
  | ProjectDetailsKnowledgeNuggetsSection
  | ProjectDetailsRiskSection
  | ProjectDetailsTechnologySection
  | ProjectDetailsPermissionsSection
  | ProjectDetailsContractsSection

type NonSectionElement = ProjectDetailsTechnologyIncompleteNote
