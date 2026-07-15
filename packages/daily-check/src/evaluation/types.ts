import type { Tile } from '../dashboard/types'

export type Status = 'green' | 'amber' | 'red' | 'none'

export interface TileResult {
  tile: Tile
  status: Status
  value: number
  formatted: string
  /** For breakdown tiles: every bucket with its own status; worst first. */
  buckets?: { key: string; value: number; status: Status }[]
}
