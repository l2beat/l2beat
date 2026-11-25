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

const UPGRADES: (Omit<GasFeesUpgrade, 'timestamp'> & {
  date: string | null
})[] = [
  {
    id: 'glamsterdam',
    kind: 'next',
    title: 'Glamsterdam',
    summary:
      'ePBS and block-level access lists, paving the way for much higher gas limits.',
    url: 'https://eips.ethereum.org/EIPS/eip-7773',
    date: null,
  },
  {
    id: 'fusaka',
    kind: 'upgrade',
    title: 'Fusaka',
    summary: 'PeerDAS: much more blob space for L2s.',
    url: 'https://eips.ethereum.org/EIPS/eip-7607',
    date: '2025-12-03',
  },
  {
    id: 'gas-limit-60m',
    kind: 'gasLimit',
    title: 'Gas limit 45M → 60M',
    summary: 'Validators signal a higher block gas limit.',
    url: 'https://pumpthegas.org',
    date: '2025-11-25',
  },
]

/**
 * Newest first, with the next scheduled upgrade on top. From November 2025,
 * where the stored fees start: an earlier upgrade has no fees to mark.
 */
export function getGasFeesUpgrades(): GasFeesUpgrade[] {
  return UPGRADES.map(({ date, ...upgrade }) => ({
    ...upgrade,
    timestamp:
      date === null ? null : UnixTime.fromDate(new Date(`${date}T00:00:00Z`)),
  }))
}
