import { formatBytes } from '@l2beat/shared-pure'

const UNITS = ['B', 'KiB', 'MiB', 'GiB', 'TiB'] as const

/**
 * Three significant digits: 1.11 GiB, 82.0 MiB, 934 MiB.
 * Labels on the graph and rows of the list have little room, and a fixed two
 * decimals spends it on digits that say nothing at this scale.
 */
export function formatPosted(bytes: number): string {
  let unitIndex = 0
  let value = bytes
  while (value >= 1024 && unitIndex < UNITS.length - 1) {
    value /= 1024
    unitIndex++
  }
  const unit = UNITS[unitIndex]
  const decimals = unit === 'B' || value >= 100 ? 0 : value >= 10 ? 1 : 2
  return formatBytes(bytes, { unit, decimals })
}
