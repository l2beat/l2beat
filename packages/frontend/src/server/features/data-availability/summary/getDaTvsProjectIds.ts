import { ProjectId } from '@l2beat/shared-pure'
import type { DaSummaryEntry } from './getDaSummaryEntries'

export interface DaTvsProjectIds {
  /** Projects that post their data to Ethereum */
  fullData: string[]
  /** Projects that settle on Ethereum but keep their data on another DA layer */
  settlementOnly: string[]
}

type System = Pick<DaSummaryEntry, 'id'> & {
  bridges: { usedIn: { id: string }[] }[]
}

/**
 * Splits the projects by where their data goes. A project that uses Ethereum
 * next to another DA layer counts as full data, so nobody is counted twice.
 */
export function getDaTvsProjectIds(publicSystems: System[]): DaTvsProjectIds {
  const usedIn = (systems: System[]) => [
    ...new Set(
      systems.flatMap((s) =>
        s.bridges.flatMap((b) => b.usedIn.map((p) => p.id)),
      ),
    ),
  ]

  const fullData = usedIn(
    publicSystems.filter((s) => s.id === ProjectId.ETHEREUM),
  )
  const onEthereum = new Set(fullData)

  return {
    fullData,
    settlementOnly: usedIn(
      publicSystems.filter((s) => s.id !== ProjectId.ETHEREUM),
    ).filter((id) => !onEthereum.has(id)),
  }
}
