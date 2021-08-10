export interface ProjectRiskView {
  stateCorrectness: ProjectRiskViewEntry
  dataAvailability: ProjectRiskViewEntry
  censorshipResistance: ProjectRiskViewEntry
  upgradeability: ProjectRiskViewEntry
  owner: ProjectRiskViewEntry
}

export interface ProjectRiskViewEntry {
  value: string
  description: string
  sentiment: 'good' | 'bad' | 'warning' | 'none' | 'unknown'
}
