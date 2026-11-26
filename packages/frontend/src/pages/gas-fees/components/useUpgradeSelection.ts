import { useMemo, useState } from 'react'

/** The upgrade hovered and the one clicked, shared by the flags, the plot and the stepper */
export interface UpgradeSelection {
  highlightedId: string | undefined
  selectedId: string | undefined
  highlight: (id: string | undefined) => void
  select: (id: string | undefined) => void
  isSelected: (id: string) => boolean
  /** Hovered or clicked: drawn in pink */
  isActive: (id: string) => boolean
}

export function useUpgradeSelection(): UpgradeSelection {
  const [highlightedId, highlight] = useState<string>()
  const [selectedId, select] = useState<string>()
  return useMemo(
    () => ({
      highlightedId,
      selectedId,
      highlight,
      select,
      isSelected: (id) => id === selectedId,
      isActive: (id) => id === selectedId || id === highlightedId,
    }),
    [highlightedId, selectedId],
  )
}
