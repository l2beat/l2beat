import { ChartSectionProps } from '../components/project/ChartSection'
import { ContractsSectionProps } from '../components/project/ContractsSection'
import { DetailedDescriptionSectionProps } from '../components/project/DetailedDescriptionSection'
import { KnowledgeNuggetsProps } from '../components/project/KnowledgeNuggetsSection'
import { MilestonesSectionProps } from '../components/project/MilestonesSection'
import { PermissionsSectionProps } from '../components/project/PermissionsSection'
import { RiskAnalysisProps } from '../components/project/RiskAnalysis'
import { RiskSectionProps } from '../components/project/RiskSection'
import { StageSectionProps } from '../components/project/StageSection'
import { StateDerivationSectionProps } from '../components/project/StateDerivationSection'
import { StateValidationSectionProps } from '../components/project/StateValidationSection'
import { TechnologyIncompleteProps } from '../components/project/TechnologyIncomplete'
import { TechnologySectionProps } from '../components/project/TechnologySection'

export interface ValueWithDisplayValue {
  value: number
  displayValue: string
}

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

export interface ProjectDetailsTechnologyIncompleteNote {
  type: 'TechnologyIncompleteNote'
  props: ProjectDetailsProps<TechnologyIncompleteProps>
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
}
