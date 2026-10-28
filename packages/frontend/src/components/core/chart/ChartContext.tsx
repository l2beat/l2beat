import type { ProjectId } from '@l2beat/shared-pure'
import * as React from 'react'
import type { ChartDataIndicatorType } from './ChartDataIndicator'

export type ChartMeta = Record<
  string,
  | {
      label: React.ReactNode
      color: string
      legendLabel?: string
      indicatorType: ChartDataIndicatorType
    }
  | undefined
>

export interface ChartProject {
  id: ProjectId
  name: string
  shortName: string | undefined
  iconUrl: string
}

type ChartContextProps = {
  meta: ChartMeta
  interactiveLegend?: {
    dataKeys: string[]
    onItemClick: (dataKey: string) => void
    disableOnboarding?: boolean
  }
  /**
   * Set while the chart is still the SVG the server drew at this size,
   * before the live chart replaces it.
   */
  serverSize?: ChartServerSize
}

export interface ChartServerSize {
  width: number
  height: number
}

export const ChartContext = React.createContext<ChartContextProps | null>(null)

export function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />')
  }

  return context
}
