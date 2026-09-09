import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { CompareProjectEntry } from '~/server/features/layer2s/compare/getCompareProjectEntries'
import { getCompareSeriesColors } from '../utils/getCompareSeriesColors'

interface CompareSeriesContextType {
  /** Series color per project id, assigned by selection order. */
  colors: Record<string, string>
  /** Project id of the chip being hovered or focused, if any. */
  hoveredProjectId: string | undefined
  setHoveredProjectId: (projectId: string | undefined) => void
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
  const [hoveredProjectId, setHoveredProjectId] = useState<string>()

  const colors = useMemo(
    () => getCompareSeriesColors(projects.map((project) => project.id)),
    [projects],
  )
  // A hover can outlive its project (chip removed mid-hover, so no
  // mouseleave fires) - ignore it instead of dimming every series with
  // nothing highlighted.
  const hovered =
    hoveredProjectId !== undefined && colors[hoveredProjectId] !== undefined
      ? hoveredProjectId
      : undefined
  const value = useMemo(
    () => ({ colors, hoveredProjectId: hovered, setHoveredProjectId }),
    [colors, hovered],
  )

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
