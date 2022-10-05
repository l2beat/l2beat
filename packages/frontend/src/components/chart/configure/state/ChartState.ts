import { ChartInput } from './ChartInput'

export interface ChartState {
  type: 'tvl' | 'activity'
  endpoint: string
  input?: ChartInput
  days: number
  altCurrency: boolean
  logScale: boolean
  token?: string
}

export interface ChartStateWithInput extends ChartState {
  input: ChartInput
}
