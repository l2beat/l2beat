import type { ActivitySectionProps } from './ActivitySection'
import type { ContractsSectionProps } from './contracts/ContractsSection'
import type { CostsSectionProps } from './costs/CostsSection'
import type { DaRiskSummarySectionProps } from './DaRiskSummarySection'
import type { DataPostedSectionProps } from './DataPostedSection'
import type { DetailedDescriptionSectionProps } from './DetailedDescriptionSection'
import type { GrissiniRiskAnalysisSectionProps } from './GrissiniRiskAnalysisSection'
import type { GroupSectionProps } from './GroupSection'
import type { L3RiskAnalysisSectionProps } from './L3RiskAnalysisSection'
import type { LivenessSectionProps } from './LivenessSection'
import type { MarkdownSectionProps } from './MarkdownSection'
import type { MilestonesAndIncidentsSectionProps } from './MilestonesAndIncidentsSection'
import type { ExtendedProjectSectionProps } from './ProjectSection'
import type { PermissionsSectionProps } from './permissions/PermissionsSection'
import type { RiskAnalysisSectionProps } from './RiskAnalysisSection'
import type { RiskSummarySectionProps } from './RiskSummarySection'
import type { SequencingSectionProps } from './SequencingSection'
import type { StackedTvsSectionProps } from './StackedTvsSection'
import type { StageSectionProps } from './StageSection'
import type { StateDerivationSectionProps } from './StateDerivationSection'
import type { StateValidationSectionProps } from './StateValidationSection'
import type { TechnologyChoicesSectionProps } from './TechnologyChoicesSection'
import type { TvsSectionProps } from './TvsSection'
import type { ThroughputSectionProps } from './throughput/ThroughputSection'

type SectionId =
  | 'tvs'
  | 'activity'
  | 'onchain-costs'
  | 'liveness'
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
  | 'sequencing'
  | 'throughput'
  | 'data-posted'

type GroupId = 'da-layer' | 'da-bridge'

export type ProjectSectionId = SectionId | GroupId | `${GroupId}-${SectionId}`

export type ProjectSectionProps = Omit<
  ExtendedProjectSectionProps,
  'className' | 'children'
>

type ProjectDetailsProps<T> = Omit<T, 'sectionOrder'>

interface ProjectDetailsCostsSection {
  type: 'CostsSection'
  props: ProjectDetailsProps<CostsSectionProps>
}

interface ProjectDetailsLivenessSection {
  type: 'LivenessSection'
  props: ProjectDetailsProps<LivenessSectionProps>
}

interface ProjectDetailsThroughputSection {
  type: 'ThroughputSection'
  props: ProjectDetailsProps<ThroughputSectionProps>
}

interface ProjectDetailsStackedTvsSection {
  type: 'StackedTvsSection'
  props: ProjectDetailsProps<StackedTvsSectionProps>
}

interface ProjectDetailsTvsSection {
  type: 'TvsSection'
  props: ProjectDetailsProps<TvsSectionProps>
}

interface ProjectDetailsActivitySection {
  type: 'ActivitySection'
  props: ProjectDetailsProps<ActivitySectionProps>
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

interface ProjectDetailsTechnologyChoicesSection {
  type: 'TechnologyChoicesSection'
  props: ProjectDetailsProps<TechnologyChoicesSectionProps>
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

interface ProjectDetailsSequencingSection {
  type: 'SequencingSection'
  props: ProjectDetailsProps<SequencingSectionProps>
}

interface ProjectDetailsPermissionsSection {
  type: 'PermissionsSection'
  props: ProjectDetailsProps<PermissionsSectionProps>
}

interface ProjectDetailsContractsSection {
  type: 'ContractsSection'
  props: ProjectDetailsProps<ContractsSectionProps>
}

interface ProjectDetailsDataPostedSection {
  type: 'DataPostedSection'
  props: ProjectDetailsProps<DataPostedSectionProps>
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
  | ProjectDetailsCostsSection
  | ProjectDetailsLivenessSection
  | ProjectDetailsDetailedDescriptionSection
  | ProjectDetailsMilestonesAndIncidentsSection
  | ProjectDetailsRiskSummarySection
  | ProjectDetailsDaRiskSummarySection
  | ProjectDetailsRiskAnalysisSection
  | L3ProjectDetailsRiskAnalysisSection
  | ProjectDetailsStageSection
  | ProjectDetailsTechnologyChoicesSection
  | ProjectDetailsStateDerivationSection
  | ProjectDetailsStateValidationSection
  | ProjectDetailsMarkdownSection
  | ProjectDetailsSequencingSection
  | ProjectDetailsPermissionsSection
  | ProjectDetailsContractsSection
  | ProjectDetailsDataPostedSection
  | ProjectDetailsUpcomingDisclaimer
  | ProjectDetailsGroup
  | ProjectDetailsGrissiniRiskAnalysisSection
  | ProjectDetailsThroughputSection
  | ProjectDetailsStackedTvsSection
  | ProjectDetailsTvsSection
  | ProjectDetailsActivitySection
)
