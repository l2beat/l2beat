import { type Milestone } from '@l2beat/config'
import { type ReactNode, createContext, useContext, useMemo } from 'react'
import { type SeriesStyle } from './styles'
import { getYAxis } from './utils/get-y-axis'

const LABEL_COUNT = 5
interface Value {
  value: number
  dashed?: boolean
}
export interface ChartColumn<T> {
  values: Value[]
  data: T
  milestone?: Milestone
}

export interface ChartContextProviderParams<T> {
  columns: ChartColumn<T>[]
  range: [number, number]
  valuesStyle: SeriesStyle[]
  formatYAxisLabel: (value: number) => string
  children?: ReactNode
}

export type ChartContextValue<T> = Omit<
  ChartContextProviderParams<T>,
  'children'
> & {
  labels: string[]
  getY: (value: number) => number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChartContext = createContext<ChartContextValue<any> | null>(null)

export function ChartContextProvider<T>({
  children,
  ...params
}: ChartContextProviderParams<T>) {
  const { columns, formatYAxisLabel } = params
  const values = columns.flatMap((column) => column.values)
  const { labels, getY } = getYAxis(
    values.map((v) => v.value),
    formatYAxisLabel,
    LABEL_COUNT,
  )

  const value = useMemo(
    () => ({ ...params, labels, getY }),
    [params, labels, getY],
  )

  return <ChartContext.Provider value={value}>{children}</ChartContext.Provider>
}

export function useChartContext<T>() {
  const context = useContext(ChartContext)
  if (!context) {
    throw new Error('useChartContext must be used within a Chart')
  }
  return context as ChartContextValue<T>
}
