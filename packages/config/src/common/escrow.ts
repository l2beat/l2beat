import type { LegacyTokenBridgedUsing } from '@l2beat/shared-pure'

/**
 * An escrow with external governance (on the host- or the destination chain) that uses the canonical bridge for messaging.
 */
const CANONICAL_ADD_TA = {
  bridgedUsing: {
    bridges: [
      {
        name: 'Canonical + additional trust assumptions',
      },
    ],
  } as LegacyTokenBridgedUsing,
  source: 'custom-canonical' as
    | 'custom-canonical'
    | 'canonical'
    | 'external'
    | 'native',
}

export const ESCROW = {
  CANONICAL_ADD_TA: CANONICAL_ADD_TA,
}
