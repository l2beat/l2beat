import { tokenList } from '../../src'
import { IntermediateConfig } from './generateIntermediateConfig'

export function generateFinalConfig(config: IntermediateConfig) {
  const destinations = config.chains.map((x) => x.name).filter(noUndefined)

  const escrows = config.escrows
    .map((escrow) => ({
      ...escrow,
      tokens: escrow.tokens
        .map((address) =>
          address === 'ETH'
            ? 'ETH'
            : tokenList.find((y) => y.address === address)?.symbol,
        )
        .filter(noUndefined),
    }))
    .filter((escrow) => escrow.tokens.length > 0)

  // TODO: figure out sinceTimestamp

  return {
    destinations,
    escrows,
  }
}

function noUndefined<T>(value: T | undefined): value is T {
  return value !== undefined
}
