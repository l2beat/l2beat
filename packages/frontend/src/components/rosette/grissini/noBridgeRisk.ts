import type { RosetteValue } from '../types'

/** What the HTML and markdown pages show in place of the DA bridge risks when there is no bridge. */
export const NO_BRIDGE_RISK = {
  name: 'DA bridge',
  value: 'No bridge',
  sentiment: 'neutral',
  description:
    'Without a DA bridge, Ethereum has no proof of data availability for this project.',
} as const satisfies RosetteValue
