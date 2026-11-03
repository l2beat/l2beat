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

/** Which of the meta's series are selected, and how to toggle one. */
export interface ChartInteractiveLegend {
  dataKeys: string[]
  onItemClick: (dataKey: string) => void
  disableOnboarding?: boolean
}

type ChartContextProps = {
  meta: ChartMeta
  interactiveLegend?: ChartInteractiveLegend
}

export const ChartContext = React.createContext<ChartContextProps | null>(null)

export function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />')
  }

  return context
}
