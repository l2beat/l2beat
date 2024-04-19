import { ChartSectionProps } from './ChartSection'
import { ContractsSectionProps } from './ContractsSection/ContractsSection'
import { DetailedDescriptionSectionProps } from './DetailedDescriptionSection'
import { KnowledgeNuggetsProps } from './KnowledgeNuggetsSection/KnowledgeNuggetsSection'
import { MilestonesSectionProps } from './MilestonesSection/MilestonesSection'
import { PermissionsSectionProps } from './PermissionsSection'
import { RiskAnalysisSectionProps } from './RiskAnalysisSection'
import { RiskSectionProps } from './RiskSection'
import { StageSectionProps } from './StageSection'
import { StateDerivationSectionProps } from './StateDerivationSection'
import { StateValidationSectionProps } from './StateValidationSection'
import { TechnologySectionProps } from './TechnologySection'
import { UpgradesAndGovernanceSectionProps } from './UpgradesAndGovernanceSection'

type ProjectDetailsProps<T> = Omit<T, 'sectionOrder'>

export interface ProjectDetailsChartSection {
  type: 'ChartSection'
  props: ProjectDetailsProps<ChartSectionProps>
}

export interface ProjectDetailsDetailedDescriptionSection {
  type: 'DetailedDescriptionSection'
  props: ProjectDetailsProps<DetailedDescriptionSectionProps>
}

export interface ProjectDetailsMilestonesSection {
  type: 'MilestonesSection'
  props: ProjectDetailsProps<MilestonesSectionProps>
}

export interface ProjectDetailsKnowledgeNuggetsSection {
  type: 'KnowledgeNuggetsSection'
  props: ProjectDetailsProps<KnowledgeNuggetsProps>
}

export interface ProjectDetailsRiskAnalysisSection {
  type: 'RiskAnalysisSection'
  props: ProjectDetailsProps<RiskAnalysisSectionProps>
}

export interface ProjectDetailsRiskSection {
  type: 'RiskSection'
  props: ProjectDetailsProps<RiskSectionProps>
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

export interface ProjectDetailsUpgradesAndGovernanceSection {
  type: 'UpgradesAndGovernanceSection'
  props: ProjectDetailsProps<UpgradesAndGovernanceSectionProps>
}

export interface ProjectDetailsPermissionsSection {
  type: 'PermissionsSection'
  props: ProjectDetailsProps<PermissionsSectionProps>
}

export interface ProjectDetailsContractsSection {
  type: 'ContractsSection'
  props: ProjectDetailsProps<ContractsSectionProps>
}

export interface ProjectDetailsUpcomingDisclaimer {
  type: 'UpcomingDisclaimer'
  excludeFromNavigation: true
}

export type ProjectDetailsSection = { excludeFromNavigation?: boolean } & (
  | ProjectDetailsChartSection
  | ProjectDetailsDetailedDescriptionSection
  | ProjectDetailsMilestonesSection
  | ProjectDetailsKnowledgeNuggetsSection
  | ProjectDetailsRiskAnalysisSection
  | ProjectDetailsRiskSection
  | ProjectDetailsStageSection
  | ProjectDetailsTechnologySection
  | ProjectDetailsStateDerivationSection
  | ProjectDetailsStateValidationSection
  | ProjectDetailsUpgradesAndGovernanceSection
  | ProjectDetailsPermissionsSection
  | ProjectDetailsContractsSection
  | ProjectDetailsUpcomingDisclaimer
)
