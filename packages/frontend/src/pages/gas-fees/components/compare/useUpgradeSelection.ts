import { useState } from 'react'
import type {
  GasFeesUpgrades,
  NextUpgrade,
  PastUpgrade,
} from '~/server/features/gas-fees/getGasFeesUpgrades'

export interface UpgradeSelection {
  past: PastUpgrade[]
  hoveredId: string | undefined
  selected: PastUpgrade | undefined
  /** The hovered upgrade, else the selected one, else the next */
  shown: PastUpgrade | NextUpgrade
  hover: (id: string | undefined) => void
  select: (id: string | undefined) => void
  /** Through the past upgrades, oldest first, and on to the next */
  step: (direction: -1 | 1) => void
  canStep: (direction: -1 | 1) => boolean
}

/** One object the chart, its flags and the strip under it share */
export function useUpgradeSelection({
  past,
  next,
}: GasFeesUpgrades): UpgradeSelection {
  const [hoveredId, hover] = useState<string>()
  const [selectedId, select] = useState<string>()
  const selectedIndex = past.findIndex((u) => u.id === selectedId)
  // With none selected, the strip shows the next upgrade: one past the last
  const position = selectedIndex === -1 ? past.length : selectedIndex
  const selected = past[selectedIndex]
  const hovered = past.find((u) => u.id === hoveredId)
  return {
    past,
    hoveredId,
    selected,
    shown: hovered ?? selected ?? next,
    hover,
    select,
    step: (direction) => select(past[position + direction]?.id),
    canStep: (direction) => {
      const to = position + direction
      return to >= 0 && to <= past.length
    },
  }
}
