import type { LegacyTokenBridgedUsing } from '@l2beat/shared-pure'

/**
 * An escrow with external governance (on the host- or the destination chain) that uses the canonical bridge for messaging.
 */
const CANONICAL_EXTERNAL = {
  bridgedUsing: {
    bridges: [
      {
        name: 'Canonical (external escrow)',
      },
    ],
  } as LegacyTokenBridgedUsing,
  source: 'external' as 'canonical' | 'external' | 'native',
}

export const ESCROW = {
  CANONICAL_EXTERNAL,
}
