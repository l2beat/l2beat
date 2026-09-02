import { formatBytes } from '@l2beat/shared-pure'

export function formatDaThroughputValue(value: number, denominator: number) {
  return formatBytes(value * denominator)
}
