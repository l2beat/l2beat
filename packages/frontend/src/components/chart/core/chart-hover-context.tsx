import type { Milestone } from '@l2beat/config'
import type { ReactNode } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'

export interface ChartHoverContextProviderParams<T> {
  renderHoverContents: (pointData: T) => ReactNode
  children?: ReactNode
}

interface Position {
  left: number
  bottom: (number | null)[]
}

interface ChartHoverContextValue<T> {
  setData: (data: T) => void
  position: Position | undefined
  setPosition: (position: Position | undefined) => void
  milestone: Milestone | undefined
  setMilestone: (milestone: Milestone | undefined) => void
  content: ReactNode
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChartHoverContext = createContext<ChartHoverContextValue<any> | null>(
  null,
)

export function ChartHoverContextProvider<T>({
  children,
  ...params
}: ChartHoverContextProviderParams<T>) {
  const [data, setData] = useState<T>()
  const [position, setPosition] = useState<Position>()
  const [milestone, setMilestone] = useState<Milestone | undefined>(undefined)

  const content: ReactNode = useMemo(() => {
    if (!data) return null
    return params.renderHoverContents(data)
  }, [data, params])

  return (
    <ChartHoverContext.Provider
      value={{
        content,
        setData,
        position,
        setPosition,
        milestone,
        setMilestone,
      }}
    >
      {children}
    </ChartHoverContext.Provider>
  )
}

export function useChartHoverContext() {
  const context = useContext(ChartHoverContext)
  if (!context) {
    throw new Error('useChartContext must be used within a Chart')
  }
  return context
}
