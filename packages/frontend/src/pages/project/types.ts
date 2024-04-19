import { ChartSectionProps } from './components/ChartSection'
import { ContractsSectionProps } from './components/ContractsSection'
import { DetailedDescriptionSectionProps } from './components/DetailedDescriptionSection'
import { KnowledgeNuggetsProps } from './components/KnowledgeNuggetsSection'
import { MilestonesSectionProps } from './components/MilestonesSection'
import { PermissionsSectionProps } from './components/PermissionsSection'
import { RiskAnalysisProps } from './components/RiskAnalysis'
import { RiskSectionProps } from './components/RiskSection'
import { StageSectionProps } from './components/StageSection'
import { StateDerivationSectionProps } from './components/StateDerivationSection'
import { StateValidationSectionProps } from './components/StateValidationSection'
import { TechnologySectionProps } from './components/TechnologySection'
import { UpgradesAndGovernanceSectionProps } from './components/UpgradesAndGovernanceSection'

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
  props: ProjectDetailsProps<RiskAnalysisProps>
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
