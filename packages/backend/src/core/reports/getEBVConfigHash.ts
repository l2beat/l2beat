import { hashJson, Token } from '@l2beat/shared-pure'

const EBV_LOGIC_VERSION = 0

export function getEBVConfigHash(tokens: Token[]) {
  return hashJson([extractEBVTokens(tokens), EBV_LOGIC_VERSION])
}

function extractEBVTokens(tokens: Token[]) {
  return tokens.map((t) => {
    return {
      assetId: t.id.toString(),
      tokenAddress: t.address?.toString() ?? '',
      sinceTimestamp: t.sinceTimestamp.toNumber(),
      decimals: t.decimals,
      premintHolderAddresses: t.premintHolderAddresses?.map(String) ?? [],
    }
  })
}
