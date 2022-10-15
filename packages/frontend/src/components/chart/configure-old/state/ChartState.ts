import { ChartInput } from './ChartInput'

export interface ChartState {
  type: 'tvl' | 'activity'
  endpoint: string
  secondaryEndpoint?: string
  mainInput?: ChartInput
  secondaryInput?: ChartInput
  days: number
  altCurrency: boolean
  logScale: boolean
  token?: string
}

export interface ChartStateWithInput extends ChartState {
  mainInput: ChartInput
}
