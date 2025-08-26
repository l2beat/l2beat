import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useEventListener } from '~/hooks/useEventListener'
import { useLocalStorage } from '~/hooks/useLocalStorage'

interface ChartLegendOnboardingContextType {
  currentLegendOnboardingId: string | null
  hasFinishedOnboarding: boolean
  hasFinishedOnboardingInitial: boolean
  setHasFinishedOnboarding: (value: boolean) => void
}

const ChartLegendOnboardingContext = createContext<
  ChartLegendOnboardingContextType | undefined
>(undefined)

interface ChartLegendOnboardingProviderProps {
  children: ReactNode
}

export function ChartLegendOnboardingProvider({
  children,
}: ChartLegendOnboardingProviderProps) {
  const [currentLegendOnboardingId, setCurrentLegendOnboardingId] = useState<
    string | null
  >(null)

  const [hasFinishedOnboarding, setHasFinishedOnboarding] = useLocalStorage(
    'has-finished-legend-onboarding',
    false,
  )

  const hasFinishedOnboardingInitial = useRef<boolean>(hasFinishedOnboarding)
  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this only once
  useEffect(() => {
    hasFinishedOnboardingInitial.current = hasFinishedOnboarding
  }, [])

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
      setCurrentLegendOnboardingId(closestLegend.id)
    }
  }, [])

  useEventListener('scroll', onScroll)

  return (
    <ChartLegendOnboardingContext.Provider
      value={{
        currentLegendOnboardingId,
        hasFinishedOnboarding,
        setHasFinishedOnboarding,
        hasFinishedOnboardingInitial: hasFinishedOnboardingInitial.current,
      }}
    >
      {children}
    </ChartLegendOnboardingContext.Provider>
  )
}

export function useChartLegendOnboarding() {
  const context = useContext(ChartLegendOnboardingContext)
  if (context === undefined) {
    throw new Error(
      'useChartLegendOnboarding must be used within ChartLegendOnboardingProvider',
    )
  }
  return context
}
