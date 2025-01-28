import { notUndefined } from '@l2beat/shared-pure'

import { tokenList } from '../../src'
import { escrowTimestamps } from './escrowTimestamps'
import type { IntermediateConfig } from './generateIntermediateConfig'

export function generateFinalConfig(config: IntermediateConfig) {
  const destinations = config.chains.map((x) => x.name).filter(notUndefined)

  const escrows = config.escrows
    .map((escrow) => ({
      ...escrow,
      tokens: escrow.tokens
        .map((address) =>
          address === 'ETH'
            ? 'ETH'
            : tokenList.find((y) => y.address === address)?.symbol,
        )
        .filter(notUndefined),
    }))
    .filter((escrow) => escrow.tokens.length > 0)
    .map((escrow) => ({
      ...escrow,
      sinceTimestamp: escrowTimestamps.get(escrow.address),
    }))

  for (const escrow of escrows) {
    if (escrow.sinceTimestamp === undefined) {
      console.error('Missing sinceTimestamp', escrow.address)
    }
  }

  return {
    destinations,
    escrows,
  }
}
