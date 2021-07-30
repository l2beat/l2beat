import { Project } from '@l2beat/config'

export interface RiskViewEntry {
  name: string
  slug: string
  stateCorrectness: RiskViewItem
  dataAvailability: RiskViewItem
  upgradeability: RiskViewItem
}

export interface RiskViewItem {
  value: string
  sentiment?: 'good' | 'bad' | 'neutral'
}

export function getRiskViewEntry(project: Project): RiskViewEntry {
  return {
    name: project.name,
    slug: project.slug,
    stateCorrectness: { value: 'Fraud Proofs' },
    dataAvailability: { value: 'On Chain', sentiment: 'good' },
    upgradeability: { value: 'Upgradable', sentiment: 'bad' },
  }
}
