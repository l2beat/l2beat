import type { Milestone } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { GAS_FEES_FIRST_DAY } from './chains'

export interface NextUpgrade {
  title: string
  summary: string
  url: string
}

export interface PastUpgrade extends NextUpgrade {
  id: string
  kind: 'upgrade' | 'gasLimit'
  timestamp: number
}

export interface GasFeesUpgrades {
  next: NextUpgrade
  /** Oldest first, from the first day stored */
  past: PastUpgrade[]
}

const NEXT: NextUpgrade = {
  title: 'Glamsterdam',
  summary:
    'ePBS and block-level access lists, paving the way for much higher gas limits.',
  url: 'https://eips.ethereum.org/EIPS/eip-7773',
}

const day = (date: string) => UnixTime.fromDate(new Date(`${date}T00:00:00Z`))

const OWN: PastUpgrade[] = [
  {
    id: 'fusaka',
    kind: 'upgrade',
    title: 'Fusaka',
    summary: 'PeerDAS: much more blob space for L2s.',
    url: 'https://eips.ethereum.org/EIPS/eip-7607',
    timestamp: day('2025-12-03'),
  },
  {
    id: 'gas-limit-60m',
    kind: 'gasLimit',
    title: 'Gas limit 45M → 60M',
    summary: 'Validators signal a higher block gas limit.',
    url: 'https://pumpthegas.org',
    timestamp: day('2025-11-25'),
  },
]

export function getGasFeesUpgrades(milestones: Milestone[]): GasFeesUpgrades {
  const fromConfig = milestones.map(
    (m): PastUpgrade => ({
      id: m.title,
      kind: 'upgrade',
      title: m.title,
      summary: m.description ?? '',
      url: m.url,
      timestamp: UnixTime.fromDate(new Date(m.date)),
    }),
  )
  const past = [...OWN, ...fromConfig]
    .filter((u) => u.timestamp >= GAS_FEES_FIRST_DAY)
    .sort((a, b) => a.timestamp - b.timestamp)
  return { next: NEXT, past }
}
