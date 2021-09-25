export interface ProjectRiskView {
  stateValidation: ProjectRiskViewEntry
  dataAvailability: ProjectRiskViewEntry
  upgradeability: ProjectRiskViewEntry
  sequencerFailure: ProjectRiskViewEntry
  validatorFailure: ProjectRiskViewEntry
}

export interface ProjectRiskViewEntry {
  value: string
  description: string
  sentiment?: 'warning' | 'bad' | 'unknown'
}
