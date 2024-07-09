import { type RiskAnalysisSectionProps } from './risk-analysis-section'

export type ProjectSectionId = 'risk-analysis' | 'risk-analysis2'

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

export interface ProjectDetailsRiskAnalysisSection2 {
  type: 'RiskAnalysisSection2'
  props: ProjectDetailsProps<RiskAnalysisSectionProps>
}

export type ProjectDetailsSection = {
  excludeFromNavigation?: boolean
} & (ProjectDetailsRiskAnalysisSection | ProjectDetailsRiskAnalysisSection2)
