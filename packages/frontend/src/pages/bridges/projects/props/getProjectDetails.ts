import { Bridge } from '@l2beat/config'
import {
  ManuallyVerifiedContracts,
  VerificationStatus,
} from '@l2beat/shared-pure'
import isEmpty from 'lodash/isEmpty'

import { ChartProps } from '../../../../components'
import { ChartSectionProps } from '../../../../components/project/ChartSection'
import { ContractsSectionProps } from '../../../../components/project/ContractsSection'
import { DetailedDescriptionSectionProps } from '../../../../components/project/DetailedDescriptionSection'
import { KnowledgeNuggetsProps } from '../../../../components/project/KnowledgeNuggetsSection'
import { MilestonesSectionProps } from '../../../../components/project/MilestonesSection'
import { PermissionsSectionProps } from '../../../../components/project/PermissionsSection'
import { RiskSectionProps } from '../../../../components/project/RiskSection'
import { TechnologyIncompleteProps } from '../../../../components/project/TechnologyIncomplete'
import { TechnologySectionProps } from '../../../../components/project/TechnologySection'
import { getContractSection } from '../../../../utils/project/getContractSection'
import { getPermissionsSection } from '../../../../utils/project/getPermissionsSection'
import {
  getProjectEditLink,
  getProjectIssueLink,
} from '../../../../utils/project/links'
import { getDetailedDescriptionSection } from './getDetailedDescriptionSection'
import { getRiskSection } from './getRiskSection'
import { getTechnologyOverview } from './getTechnologyOverview'

export function getProjectDetails(
  bridge: Bridge,
  verificationStatus: VerificationStatus,
  manuallyVerifiedContracts: ManuallyVerifiedContracts,
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
    props: { ...chart, id: 'chart', title: 'Chart' },
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
      props: getDetailedDescriptionSection(bridge),
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
  | ChartSection
  | DetailedDescriptionSection
  | MilestonesSection
  | KnowledgeNuggetsSection
  | RiskSection
  | TechnologySection
  | PermissionsSection
  | ContractsSection

type NonSectionElement = TechnologyIncompleteNote

interface ChartSection {
  type: 'ChartSection'
  props: ChartSectionProps
}
interface DetailedDescriptionSection {
  type: 'DetailedDescriptionSection'
  props: DetailedDescriptionSectionProps
}

interface MilestonesSection {
  type: 'MilestonesSection'
  props: MilestonesSectionProps
}

interface KnowledgeNuggetsSection {
  type: 'KnowledgeNuggetsSection'
  props: KnowledgeNuggetsProps
}

interface RiskSection {
  type: 'RiskSection'
  props: RiskSectionProps
}

interface TechnologyIncompleteNote {
  type: 'TechnologyIncompleteNote'
  props: TechnologyIncompleteProps
}
interface TechnologySection {
  type: 'TechnologySection'
  props: TechnologySectionProps
}

interface PermissionsSection {
  type: 'PermissionsSection'
  props: PermissionsSectionProps
}

interface ContractsSection {
  type: 'ContractsSection'
  props: ContractsSectionProps
}
