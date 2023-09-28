import { LocalStorage } from '../local-storage/LocalStorage'
import { SavedChartSettings, SavedChartState } from '../local-storage/types'

export type ChartSettings = ReturnType<
  typeof ChartSettingsManager.prototype.for
>

const DEFAULT_VALUES = {
  useLogScale: false,
  useAltCurrency: false,
  timeRange: '1Y',
  showEthereumTransactions: true,
} as const

export class ChartSettingsManager {
  private readonly state: SavedChartState

  constructor() {
    this.state = LocalStorage.getItem('chart-settings') ?? {}
  }

  for(chartId: string) {
    return {
      getUseLogScale: () => {
        return this.get(chartId).useLogScale
      },
      setUseLogScale: (value: boolean) => {
        this.update(chartId, { useLogScale: value })
      },
      getUseAltCurrency: () => {
        return this.get(chartId).useAltCurrency
      },
      setUseAltCurrency: (value: boolean) => {
        this.update(chartId, { useAltCurrency: value })
      },
      getTimeRange: () => {
        return this.get(chartId).timeRange
      },
      setTimeRange: (value: '7D' | '30D' | '90D' | '180D' | '1Y' | 'MAX') => {
        this.update(chartId, { timeRange: value })
      },
      getShowEthereumTransactions: () => {
        return this.get(chartId).showEthereumTransactions
      },
      setShowEthereumTransactions: (value: boolean) => {
        this.update(chartId, { showEthereumTransactions: value })
      },
    }
  }

  private get(chartId: string) {
    return this.state[chartId] ?? { ...DEFAULT_VALUES }
  }

  private update(chartId: string, values: Partial<SavedChartSettings>) {
    const settings = this.state[chartId] ?? { ...DEFAULT_VALUES }
    this.state[chartId] = { ...settings, ...values }
    LocalStorage.setItem('chart-settings', this.state)
  }
}
