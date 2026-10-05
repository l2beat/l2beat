import { lazy } from 'react'
import type { LabVariant } from './types'

export const HUB_VARIANT_ID = 'hub'

/**
 * The current hub graph comes first, to compare the others against. Each
 * variant loads on its own, so one that breaks takes down only itself.
 */
export const LAB_VARIANTS: LabVariant[] = [
  {
    id: HUB_VARIANT_ID,
    name: 'Hub',
    description:
      'The current design. Every project sends its blobs into Ethereum as particles, in bursts the size of its batches.',
  },
  {
    id: 'blocks',
    name: 'Block by block',
    description:
      'Every 12 seconds Ethereum makes a block with room for a set number of blobs. Watch batches land in each one, and see how much room is left.',
    Component: lazy(() =>
      import('./variants/blocks/BlockByBlock').then((m) => ({
        default: m.BlockByBlock,
      })),
    ),
  },
  {
    id: 'orbits',
    name: 'Orbits',
    description:
      'Each project circles Ethereum once per batch. The more often it posts, the tighter and faster its orbit.',
    Component: lazy(() =>
      import('./variants/orbits/Orbits').then((m) => ({ default: m.Orbits })),
    ),
  },
  {
    id: 'drip',
    name: 'Drip',
    description:
      "Each project's blob swells while its next batch fills, then drips into Ethereum. Big drops are big batches.",
    Component: lazy(() =>
      import('./variants/drip/Drip').then((m) => ({ default: m.Drip })),
    ),
  },
  {
    id: 'beat',
    name: 'Beat',
    description:
      'Blocks become the steps of a sequencer and batches become notes. Turn the sound on to hear how each project posts.',
    Component: lazy(() =>
      import('./variants/beat/Beat').then((m) => ({ default: m.Beat })),
    ),
  },
  {
    id: 'departures',
    name: 'Departures',
    description:
      'A departure board of blob batches: what each project sends, how often, and when its next one leaves.',
    fullWidth: true,
    Component: lazy(() =>
      import('./variants/departures/Departures').then((m) => ({
        default: m.Departures,
      })),
    ),
  },
  {
    id: 'strata',
    name: 'Strata',
    description:
      "Yesterday's blobs poured into Ethereum hour by hour. The diamond holds a full day at the blob limit, and every layer is an hour.",
    Component: lazy(() =>
      import('./variants/strata/Strata').then((m) => ({ default: m.Strata })),
    ),
  },
]
