import type { Milestone } from '@l2beat/config'
import type { ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'
import type { SeriesStyle } from './styles'
import { getYAxis } from './utils/get-y-axis'

interface Value {
  value: number
  dashed?: boolean
}
export interface ChartColumn<
  T extends { timestamp: number } = { timestamp: number },
> {
  values: Value[]
  data: T
  milestone?: Milestone
}

export interface ChartContextProviderParams<T extends { timestamp: number }> {
  columns: ChartColumn<T>[]
  range: '1d' | '7d' | '30d' | '90d' | '180d' | '1y' | 'max'
  valuesStyle: SeriesStyle[]
  formatYAxisLabel: (value: number, allValues?: number[]) => string
  useLogScale?: boolean
  children?: ReactNode
}

export type ChartContextValue<T extends { timestamp: number }> = Omit<
  ChartContextProviderParams<T>,
  'children'
> & {
  labels: string[]
  getY: (value: number) => number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChartContext = createContext<ChartContextValue<any> | null>(null)

export function ChartContextProvider<T extends { timestamp: number }>({
  children,
  ...params
}: ChartContextProviderParams<T>) {
  const { columns, useLogScale, formatYAxisLabel } = params
  const values = columns.flatMap((column) => column.values)
  const { labels, getY } = getYAxis(
    values.map((v) => v.value),
    !!useLogScale,
    formatYAxisLabel,
  )

  const value = useMemo(
    () => ({ ...params, labels, getY }),
    [params, labels, getY],
  )

  return <ChartContext.Provider value={value}>{children}</ChartContext.Provider>
}

export function useChartContext<T extends { timestamp: number }>() {
  const context = useContext(ChartContext)
  if (!context) {
    throw new Error('useChartContext must be used within a Chart')
  }
  return context as ChartContextValue<T>
}
