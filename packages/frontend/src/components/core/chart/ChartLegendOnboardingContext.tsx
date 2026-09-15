import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { useLocalStorage } from '~/hooks/useLocalStorage'

interface ChartLegendOnboardingContextType {
  hasFinishedOnboarding: boolean
  hasFinishedOnboardingInitial: boolean
  setHasFinishedOnboarding: (value: boolean) => void
}

const ChartLegendOnboardingContext = createContext<
  ChartLegendOnboardingContextType | undefined
>(undefined)

/**
 * Hints are marked with `data-legend-onboarding-hint`; the provider sets
 * `data-current` on whichever is closest to the viewport centre.
 */
export const legendOnboardingHintClassName =
  'opacity-0 data-current:opacity-100'
const HINT_SELECTOR = '[data-legend-onboarding-hint]'
const CURRENT_ATTRIBUTE = 'data-current'

interface ChartLegendOnboardingProviderProps {
  children: ReactNode
}

export function ChartLegendOnboardingProvider({
  children,
}: ChartLegendOnboardingProviderProps) {
  const [hasFinishedOnboarding, setHasFinishedOnboarding] = useLocalStorage(
    'has-finished-legend-onboarding',
    false,
  )

  const hasFinishedOnboardingInitial = useRef<boolean>(hasFinishedOnboarding)
  // biome-ignore lint/correctness/useExhaustiveDependencies: we want to run this only once
  useEffect(() => {
    hasFinishedOnboardingInitial.current = hasFinishedOnboarding
  }, [])

  // Done in the DOM rather than React state: a scroll-driven context value
  // re-rendered every chart on the page, and each chart re-render makes
  // recharts re-measure itself with forced layouts.
  useEffect(() => {
    if (hasFinishedOnboarding) return
    window.addEventListener('scroll', markHintClosestToViewportCenter, {
      passive: true,
    })
    return () =>
      window.removeEventListener('scroll', markHintClosestToViewportCenter)
  }, [hasFinishedOnboarding])

  const value = useMemo(
    () => ({
      hasFinishedOnboarding,
      setHasFinishedOnboarding,
      hasFinishedOnboardingInitial: hasFinishedOnboardingInitial.current,
    }),
    [hasFinishedOnboarding, setHasFinishedOnboarding],
  )

  return (
    <ChartLegendOnboardingContext.Provider value={value}>
      {children}
    </ChartLegendOnboardingContext.Provider>
  )
}

function markHintClosestToViewportCenter() {
  const hints = document.querySelectorAll(HINT_SELECTOR)
  const viewportCenter = window.innerHeight / 2
  let closest: Element | undefined
  let minDistance = Number.POSITIVE_INFINITY

  for (const hint of hints) {
    const rect = hint.getBoundingClientRect()
    const distance = Math.abs(viewportCenter - (rect.top + rect.height / 2))
    if (distance < minDistance) {
      minDistance = distance
      closest = hint
    }
  }

  for (const hint of hints) {
    hint.toggleAttribute(CURRENT_ATTRIBUTE, hint === closest)
  }
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
