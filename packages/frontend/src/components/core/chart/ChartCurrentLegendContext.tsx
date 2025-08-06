import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react'
import { useEventListener } from '~/hooks/useEventListener'

const ChartCurrentLegendContext = createContext<string | null | undefined>(
  undefined,
)

interface ChartCurrentLegendProviderProps {
  children: ReactNode
}

export function ChartCurrentLegendProvider({
  children,
}: ChartCurrentLegendProviderProps) {
  const [chartCurrentLegend, setChartCurrentLegend] = useState<string | null>(
    null,
  )

  const onScroll = useCallback(() => {
    const legends = document.querySelectorAll('[data-role="legend-onboarding"]')
    if (legends.length === 0) {
      return
    }

    const viewportCenter = window.innerHeight / 2
    let closestLegend = null
    let minDistance = Number.POSITIVE_INFINITY

    for (const legend of legends) {
      const rect = legend.getBoundingClientRect()
      const legendCenter = rect.top + rect.height / 2
      const distance = Math.abs(viewportCenter - legendCenter)

      if (distance < minDistance) {
        minDistance = distance
        closestLegend = legend
      }
    }

    if (closestLegend?.id) {
      setChartCurrentLegend(closestLegend.id)
    }
  }, [])

  useEventListener('scroll', onScroll)

  return (
    <ChartCurrentLegendContext.Provider value={chartCurrentLegend}>
      {children}
    </ChartCurrentLegendContext.Provider>
  )
}

export function useChartCurrentLegend() {
  const context = useContext(ChartCurrentLegendContext)
  if (context === undefined) {
    throw new Error(
      'useChartCurrentLegend must be used within ChartCurrentLegendProvider',
    )
  }
  return context
}
