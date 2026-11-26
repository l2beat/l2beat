import type { Milestone } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'

export interface GasFeesUpgrade {
  id: string
  kind: 'upgrade' | 'gasLimit' | 'next'
  title: string
  summary: string
  url: string
  /** Day it activated, null when not scheduled yet */
  timestamp: number | null
}

/** Where the stored fees start: an earlier upgrade has no fees to mark */
const FIRST_DAY = toDay('2025-11-01T00:00:00Z')

/** What Ethereum's milestones in the config don't list */
const OWN_UPGRADES: GasFeesUpgrade[] = [
  {
    id: 'glamsterdam',
    kind: 'next',
    title: 'Glamsterdam',
    summary:
      'ePBS and block-level access lists, paving the way for much higher gas limits.',
    url: 'https://eips.ethereum.org/EIPS/eip-7773',
    timestamp: null,
  },
  {
    id: 'fusaka',
    kind: 'upgrade',
    title: 'Fusaka',
    summary: 'PeerDAS: much more blob space for L2s.',
    url: 'https://eips.ethereum.org/EIPS/eip-7607',
    timestamp: toDay('2025-12-03T00:00:00Z'),
  },
  {
    id: 'gas-limit-60m',
    kind: 'gasLimit',
    title: 'Gas limit 45M → 60M',
    summary: 'Validators signal a higher block gas limit.',
    url: 'https://pumpthegas.org',
    timestamp: toDay('2025-11-25T00:00:00Z'),
  },
]

/** Newest first, with the next scheduled upgrade on top */
export function getGasFeesUpgrades(milestones: Milestone[]): GasFeesUpgrade[] {
  const fromConfig = milestones.map(
    (milestone): GasFeesUpgrade => ({
      id: milestone.title,
      kind: 'upgrade',
      title: milestone.title,
      summary: milestone.description ?? '',
      url: milestone.url,
      timestamp: toDay(milestone.date),
    }),
  )
  return [...OWN_UPGRADES, ...fromConfig]
    .filter((u) => u.timestamp === null || u.timestamp >= FIRST_DAY)
    .sort(
      (a, b) =>
        (b.timestamp ?? Number.POSITIVE_INFINITY) -
        (a.timestamp ?? Number.POSITIVE_INFINITY),
    )
}

function toDay(date: string) {
  return UnixTime.toStartOf(UnixTime.fromDate(new Date(date)), 'day')
}
