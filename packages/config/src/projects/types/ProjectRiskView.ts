export interface ProjectRiskView {
  stateValidation: ProjectRiskViewEntry
  dataAvailability: ProjectRiskViewEntry
  upgradeability: ProjectRiskViewEntry
  operatorCensoring: ProjectRiskViewEntry
  operatorDown: ProjectRiskViewEntry
}

export interface ProjectRiskViewEntry {
  value: string
  description: string
  sentiment?: 'warning' | 'bad' | 'unknown'
}
