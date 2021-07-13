import { ChartInput } from './ChartInput'

export interface ChartState {
  endpoint?: string
  input?: ChartInput
  days: number
  altCurrency: boolean
  logScale: boolean
}

export interface ChartStateWithInput extends ChartState {
  input: ChartInput
}
