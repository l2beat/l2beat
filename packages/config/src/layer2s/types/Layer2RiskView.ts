export interface Layer2RiskView {
  stateValidation: Layer2RiskViewEntry
  dataAvailability: Layer2RiskViewEntry
  upgradeability: Layer2RiskViewEntry
  sequencerFailure: Layer2RiskViewEntry
  validatorFailure: Layer2RiskViewEntry
}

export interface Layer2RiskViewEntry {
  value: string
  description: string
  sentiment?: 'warning' | 'bad' | 'unknown'
}
