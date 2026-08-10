import { createContext, type ReactNode, useContext, useMemo } from 'react'
import type { CompareProjectEntry } from '~/server/features/scaling/compare/getCompareProjectEntries'
import { getCompareSeriesColors } from '../utils/getCompareSeriesColors'

interface CompareSeriesContextType {
  /** Series color per project id, assigned by selection order. */
  colors: Record<string, string>
}

const CompareSeriesContext = createContext<
  CompareSeriesContextType | undefined
>(undefined)

/**
 * Shared per-series state of the compare page, provided by the common parent
 * of the selection strip and the chart. Both read the color mapping from
 * here, so a chip always matches its line, legend entry and tooltip
 * indicator.
 */
export function CompareSeriesProvider({
  projects,
  children,
}: {
  projects: CompareProjectEntry[]
  children: ReactNode
}) {
  const colors = useMemo(
    () => getCompareSeriesColors(projects.map((project) => project.id)),
    [projects],
  )
  const value = useMemo(() => ({ colors }), [colors])

  return (
    <CompareSeriesContext.Provider value={value}>
      {children}
    </CompareSeriesContext.Provider>
  )
}

export function useCompareSeries() {
  const context = useContext(CompareSeriesContext)
  if (context === undefined) {
    throw new Error(
      'useCompareSeries must be used within CompareSeriesProvider',
    )
  }
  return context
}
