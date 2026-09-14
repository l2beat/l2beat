import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useEventListener } from '~/hooks/useEventListener'
import { useLocalStorage } from '~/hooks/useLocalStorage'

interface ChartLegendOnboardingContextType {
  hasFinishedOnboarding: boolean
  hasFinishedOnboardingInitial: boolean
  setHasFinishedOnboarding: (value: boolean) => void
}

const ChartLegendOnboardingContext = createContext<
  ChartLegendOnboardingContextType | undefined
>(undefined)

// Updated on scroll, so it lives in its own context: only the legend hint
// that shows it re-renders, not every chart on the page. A chart re-render
// makes recharts re-measure itself with forced layouts, which is what made
// scrolling project pages stutter.
const CurrentLegendOnboardingIdContext = createContext<string | null>(null)

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
    if (hasFinishedOnboarding) {
      return
    }
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
  }, [hasFinishedOnboarding])

  useEventListener('scroll', onScroll)

  const settings = useMemo(
    () => ({
      hasFinishedOnboarding,
      setHasFinishedOnboarding,
      hasFinishedOnboardingInitial: hasFinishedOnboardingInitial.current,
    }),
    [hasFinishedOnboarding, setHasFinishedOnboarding],
  )

  return (
    <ChartLegendOnboardingContext.Provider value={settings}>
      <CurrentLegendOnboardingIdContext.Provider
        value={currentLegendOnboardingId}
      >
        {children}
      </CurrentLegendOnboardingIdContext.Provider>
    </ChartLegendOnboardingContext.Provider>
  )
}

export function useCurrentLegendOnboardingId() {
  return useContext(CurrentLegendOnboardingIdContext)
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
