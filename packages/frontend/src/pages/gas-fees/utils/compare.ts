import { formatRatio } from './format'

export interface Comparison {
  ratio: string
  /** Whether the other side costs less than Ethereum */
  cheaper: boolean
}

/** How many times one cost goes into the other; nothing when that is not a finite positive number */
export function compareCosts(
  cost: number,
  ethereum: number,
): Comparison | undefined {
  if (!(cost > 0) || !(ethereum > 0)) return undefined
  const cheaper = cost <= ethereum
  const ratio = cheaper ? ethereum / cost : cost / ethereum
  if (!Number.isFinite(ratio)) return undefined
  return { ratio: formatRatio(ratio), cheaper }
}
