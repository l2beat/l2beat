import { hashJson, Token } from '@l2beat/shared-pure'

const LOGIC_VERSION = 0

export function getTotalSupplyFormulaConfigHash(tokens: Token[]) {
  return hashJson([extractTokens(tokens), LOGIC_VERSION])
}

function extractTokens(tokens: Token[]) {
  return tokens.map((t) => {
    return {
      assetId: t.id.toString(),
      tokenAddress: t.address?.toString() ?? '',
      sinceTimestamp: t.sinceTimestamp.toNumber(),
      decimals: t.decimals,
      formula: t.formula,
    }
  })
}
