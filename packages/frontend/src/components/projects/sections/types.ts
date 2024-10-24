import { type ChartSectionProps } from './chart-section'
import { type ContractsSectionProps } from './contracts/contracts-section'
import { type DetailedDescriptionSectionProps } from './detailed-description-section'
import { GroupSectionProps } from './group-section'
import { type KnowledgeNuggetsSectionProps } from './knowledge-nuggets-section'
import { type L3RiskAnalysisSectionProps } from './l3-risk-analysis-section'
import { type MarkdownSectionProps } from './markdown-section'
import { type MilestonesAndIncidentsSectionProps } from './milestones-and-incidents-section'
import { type PermissionsSectionProps } from './permissions/permissions-section'
import { type ExtendedProjectSectionProps } from './project-section'
import { type RiskAnalysisSectionProps } from './risk-analysis-section'
import { type RiskSummarySectionProps } from './risk-summary-section'
import { type StageSectionProps } from './stage-section'
import { type StateDerivationSectionProps } from './state-derivation-section'
import { type StateValidationSectionProps } from './state-validation-section'
import { type TechnologySectionProps } from './technology-section'

export type ProjectSectionId =
  | 'da-layer'
  | 'da-bridge'
  | 'tvl'
  | 'activity'
  | 'onchain-costs'
  | 'detailed-description'
  | 'milestones-and-incidents'
  | 'risk-summary'
  | 'risk-analysis'
  | 'l3-risk-analysis'
  | 'stage'
  | 'technology'
  | 'da-layer-technology'
  | 'da-bridge-technology'
  | 'operator'
  | 'withdrawals'
  | 'other-considerations'
  | 'state-derivation'
  | 'state-validation'
  | 'upgrades-and-governance'
  | 'permissions'
  | 'contracts'
  | 'knowledge-nuggets'

export type ProjectSectionProps = Omit<
  ExtendedProjectSectionProps,
  'className' | 'children'
>

type ProjectDetailsProps<T> = Omit<T, 'sectionOrder'>

export interface ProjectDetailsChartSection {
  type: 'ChartSection'
  props: ProjectDetailsProps<ChartSectionProps>
}

export interface ProjectDetailsDetailedDescriptionSection {
  type: 'DetailedDescriptionSection'
  props: ProjectDetailsProps<DetailedDescriptionSectionProps>
}

export interface ProjectDetailsMilestonesAndIncidentsSection {
  type: 'MilestonesAndIncidentsSection'
  props: ProjectDetailsProps<MilestonesAndIncidentsSectionProps>
}

export interface ProjectDetailsRiskSummarySection {
  type: 'RiskSummarySection'
  props: ProjectDetailsProps<RiskSummarySectionProps>
}

export interface ProjectDetailsRiskAnalysisSection {
  type: 'RiskAnalysisSection'
  props: ProjectDetailsProps<RiskAnalysisSectionProps>
}

export interface L3ProjectDetailsRiskAnalysisSection {
  type: 'L3RiskAnalysisSection'
  props: ProjectDetailsProps<L3RiskAnalysisSectionProps>
}

export interface ProjectDetailsStageSection {
  type: 'StageSection'
  props: ProjectDetailsProps<StageSectionProps>
}

export interface ProjectDetailsTechnologySection {
  type: 'TechnologySection'
  props: ProjectDetailsProps<TechnologySectionProps>
}

export interface ProjectDetailsStateDerivationSection {
  type: 'StateDerivationSection'
  props: ProjectDetailsProps<StateDerivationSectionProps>
}

export interface ProjectDetailsStateValidationSection {
  type: 'StateValidationSection'
  props: ProjectDetailsProps<StateValidationSectionProps>
}

export interface ProjectDetailsMarkdownSection {
  type: 'MarkdownSection'
  props: ProjectDetailsProps<MarkdownSectionProps>
}

export interface ProjectDetailsPermissionsSection {
  type: 'PermissionsSection'
  props: ProjectDetailsProps<PermissionsSectionProps>
}

export interface ProjectDetailsContractsSection {
  type: 'ContractsSection'
  props: ProjectDetailsProps<ContractsSectionProps>
}

export interface ProjectDetailsKnowledgeNuggetsSection {
  type: 'KnowledgeNuggetsSection'
  props: ProjectDetailsProps<KnowledgeNuggetsSectionProps>
}

export interface ProjectDetailsUpcomingDisclaimer {
  type: 'UpcomingDisclaimer'
  excludeFromNavigation: true
}

export interface ProjectDetailsGroup {
  type: 'Group'
  props: ProjectDetailsProps<GroupSectionProps>
}

export type ProjectDetailsSection = {
  excludeFromNavigation?: boolean
} & (
  | ProjectDetailsChartSection
  | ProjectDetailsDetailedDescriptionSection
  | ProjectDetailsMilestonesAndIncidentsSection
  | ProjectDetailsRiskSummarySection
  | ProjectDetailsRiskAnalysisSection
  | L3ProjectDetailsRiskAnalysisSection
  | ProjectDetailsStageSection
  | ProjectDetailsTechnologySection
  | ProjectDetailsStateDerivationSection
  | ProjectDetailsStateValidationSection
  | ProjectDetailsMarkdownSection
  | ProjectDetailsPermissionsSection
  | ProjectDetailsContractsSection
  | ProjectDetailsKnowledgeNuggetsSection
  | ProjectDetailsUpcomingDisclaimer
  | ProjectDetailsGroup
)
