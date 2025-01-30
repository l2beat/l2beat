import type { ChartSectionProps } from './chart-section'
import type { ContractsSectionProps } from './contracts/contracts-section'
import type { MultiChainContractsSectionProps } from './contracts/multichain-contracts-section'
import type { DaRiskSummarySectionProps } from './da-risk-summary-section'
import type { DetailedDescriptionSectionProps } from './detailed-description-section'
import type { GrissiniRiskAnalysisSectionProps } from './grissini-risk-analysis-section'
import type { GroupSectionProps } from './group-section'
import type { KnowledgeNuggetsSectionProps } from './knowledge-nuggets-section'
import type { L3RiskAnalysisSectionProps } from './l3-risk-analysis-section'
import type { MarkdownSectionProps } from './markdown-section'
import type { MilestonesAndIncidentsSectionProps } from './milestones-and-incidents-section'
import type { PermissionsSectionProps } from './permissions/permissions-section'
import type { ExtendedProjectSectionProps } from './project-section'
import type { RiskAnalysisSectionProps } from './risk-analysis-section'
import type { RiskSummarySectionProps } from './risk-summary-section'
import type { StageSectionProps } from './stage-section'
import type { StateDerivationSectionProps } from './state-derivation-section'
import type { StateValidationSectionProps } from './state-validation-section'
import type { TechnologySectionProps } from './technology-section'

type SectionId =
  | 'tvs'
  | 'activity'
  | 'onchain-costs'
  | 'detailed-description'
  | 'milestones-and-incidents'
  | 'risk-summary'
  | 'risk-analysis'
  | 'l3-risk-analysis'
  | 'stage'
  | 'technology'
  | 'operator'
  | 'withdrawals'
  | 'other-considerations'
  | 'state-derivation'
  | 'state-validation'
  | 'upgrades-and-governance'
  | 'permissions'
  | 'contracts'
  | 'knowledge-nuggets'

type GroupId = 'da-layer' | 'da-bridge'

export type ProjectSectionId = SectionId | GroupId | `${GroupId}-${SectionId}`

export type ProjectSectionProps = Omit<
  ExtendedProjectSectionProps,
  'className' | 'children'
>

type ProjectDetailsProps<T> = Omit<T, 'sectionOrder'>

interface ProjectDetailsChartSection {
  type: 'ChartSection'
  props: ProjectDetailsProps<ChartSectionProps>
}

interface ProjectDetailsDetailedDescriptionSection {
  type: 'DetailedDescriptionSection'
  props: ProjectDetailsProps<DetailedDescriptionSectionProps>
}

interface ProjectDetailsMilestonesAndIncidentsSection {
  type: 'MilestonesAndIncidentsSection'
  props: ProjectDetailsProps<MilestonesAndIncidentsSectionProps>
}

interface ProjectDetailsRiskSummarySection {
  type: 'RiskSummarySection'
  props: ProjectDetailsProps<RiskSummarySectionProps>
}

interface ProjectDetailsDaRiskSummarySection {
  type: 'DaRiskSummarySection'
  props: ProjectDetailsProps<DaRiskSummarySectionProps>
}

interface ProjectDetailsRiskAnalysisSection {
  type: 'RiskAnalysisSection'
  props: ProjectDetailsProps<RiskAnalysisSectionProps>
}

interface L3ProjectDetailsRiskAnalysisSection {
  type: 'L3RiskAnalysisSection'
  props: ProjectDetailsProps<L3RiskAnalysisSectionProps>
}

interface ProjectDetailsStageSection {
  type: 'StageSection'
  props: ProjectDetailsProps<StageSectionProps>
}

interface ProjectDetailsTechnologySection {
  type: 'TechnologySection'
  props: ProjectDetailsProps<TechnologySectionProps>
}

interface ProjectDetailsStateDerivationSection {
  type: 'StateDerivationSection'
  props: ProjectDetailsProps<StateDerivationSectionProps>
}

interface ProjectDetailsStateValidationSection {
  type: 'StateValidationSection'
  props: ProjectDetailsProps<StateValidationSectionProps>
}

interface ProjectDetailsMarkdownSection {
  type: 'MarkdownSection'
  props: ProjectDetailsProps<MarkdownSectionProps>
}

interface ProjectDetailsPermissionsSection {
  type: 'PermissionsSection'
  props: ProjectDetailsProps<PermissionsSectionProps>
}

interface ProjectDetailsContractsSection {
  type: 'ContractsSection'
  props: ProjectDetailsProps<ContractsSectionProps>
}

interface ProjectDetailsMultiChainContractsSection {
  type: 'MultichainContractsSection'
  props: ProjectDetailsProps<MultiChainContractsSectionProps>
}

interface ProjectDetailsKnowledgeNuggetsSection {
  type: 'KnowledgeNuggetsSection'
  props: ProjectDetailsProps<KnowledgeNuggetsSectionProps>
}

interface ProjectDetailsUpcomingDisclaimer {
  type: 'UpcomingDisclaimer'
  excludeFromNavigation: true
}

interface ProjectDetailsGroup {
  type: 'Group'
  props: ProjectDetailsProps<GroupSectionProps>
}

interface ProjectDetailsGrissiniRiskAnalysisSection {
  type: 'GrissiniRiskAnalysisSection'
  props: ProjectDetailsProps<GrissiniRiskAnalysisSectionProps>
}

export type ProjectDetailsSection = {
  excludeFromNavigation?: boolean
  sideNavTitle?: string
} & (
  | ProjectDetailsChartSection
  | ProjectDetailsDetailedDescriptionSection
  | ProjectDetailsMilestonesAndIncidentsSection
  | ProjectDetailsRiskSummarySection
  | ProjectDetailsDaRiskSummarySection
  | ProjectDetailsRiskAnalysisSection
  | L3ProjectDetailsRiskAnalysisSection
  | ProjectDetailsStageSection
  | ProjectDetailsTechnologySection
  | ProjectDetailsStateDerivationSection
  | ProjectDetailsStateValidationSection
  | ProjectDetailsMarkdownSection
  | ProjectDetailsPermissionsSection
  | ProjectDetailsContractsSection
  | ProjectDetailsMultiChainContractsSection
  | ProjectDetailsKnowledgeNuggetsSection
  | ProjectDetailsUpcomingDisclaimer
  | ProjectDetailsGroup
  | ProjectDetailsGrissiniRiskAnalysisSection
)
