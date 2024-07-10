import { type MarkdownSectionProps } from './markdown-section'
import { type PermissionsSectionProps } from './permissions/permissions-section'
import { type RiskAnalysisSectionProps } from './risk-analysis-section'

export type ProjectSectionId =
  | 'risk-analysis'
  | 'da-layer-technology'
  | 'da-bridge-technology'
  | 'da-bridge-permissions'

export interface ProjectSectionProps {
  id: ProjectSectionId
  title: string
  sectionOrder: number
}

type ProjectDetailsProps<T> = Omit<T, 'sectionOrder'>

export interface ProjectDetailsRiskAnalysisSection {
  type: 'RiskAnalysisSection'
  props: ProjectDetailsProps<RiskAnalysisSectionProps>
}

export interface ProjectDetailsMarkdownSection {
  type: 'MarkdownSection'
  props: ProjectDetailsProps<MarkdownSectionProps>
}

export interface ProjectDetailsPermissionsSection {
  type: 'PermissionsSection'
  props: ProjectDetailsProps<PermissionsSectionProps>
}

export type ProjectDetailsSection = {
  excludeFromNavigation?: boolean
} & (
  | ProjectDetailsRiskAnalysisSection
  | ProjectDetailsMarkdownSection
  | ProjectDetailsPermissionsSection
)
