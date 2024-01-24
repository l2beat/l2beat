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

export interface ProjectDetailsChartSection {
  type: 'ChartSection'
  props: ChartSectionProps
}
export interface ProjectDetailsDetailedDescriptionSection {
  type: 'DetailedDescriptionSection'
  props: DetailedDescriptionSectionProps
}

export interface ProjectDetailsMilestonesSection {
  type: 'MilestonesSection'
  props: MilestonesSectionProps
}

export interface ProjectDetailsKnowledgeNuggetsSection {
  type: 'KnowledgeNuggetsSection'
  props: KnowledgeNuggetsProps
}

export interface ProjectDetailsRiskAnalysisSection {
  type: 'RiskAnalysisSection'
  props: RiskAnalysisProps
}

export interface ProjectDetailsRiskSection {
  type: 'RiskSection'
  props: RiskSectionProps
}

export interface ProjectDetailsStageSection {
  type: 'StageSection'
  props: StageSectionProps
}

export interface ProjectDetailsTechnologyIncompleteNote {
  type: 'TechnologyIncompleteNote'
  props: TechnologyIncompleteProps
}
export interface ProjectDetailsTechnologySection {
  type: 'TechnologySection'
  props: TechnologySectionProps
}

export interface ProjectDetailsStateDerivationSection {
  type: 'StateDerivationSection'
  props: StateDerivationSectionProps
}

export interface ProjectDetailsStateValidationSection {
  type: 'StateValidationSection'
  props: StateValidationSectionProps
}

export interface ProjectDetailsPermissionsSection {
  type: 'PermissionsSection'
  props: PermissionsSectionProps
}

export interface ProjectDetailsContractsSection {
  type: 'ContractsSection'
  props: ContractsSectionProps
}

export interface ProjectDetailsUpcomingDisclaimer {
  type: 'UpcomingDisclaimer'
}
