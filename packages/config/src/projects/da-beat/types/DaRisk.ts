export interface DaRisk {
  type: string
  value: string
  sentiment: 'good' | 'warning' | 'bad'
  description: string
}
