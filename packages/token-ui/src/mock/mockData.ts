import tokens from './tokens.json'
import type { AbstractToken, DeployedToken } from './types'

export function parseChains() {
  return parseDeployedTokens()
    .map((token) => token.chain)
    .filter((chain, index, self) => self.indexOf(chain) === index)
}

export function parseAbstractTokens(): AbstractToken[] {
  return tokens.abstractTokens.map((token) => {
    const [id, rest] = token.id.split(':')
    const [issuer, symbol] = rest?.split('.') ?? []

    if (!id || !symbol) {
      throw new Error('Invalid abstract token')
    }

    return {
      id,
      issuer: issuer ?? null,
      symbol,
      category: token.category as AbstractToken['category'],
      iconUrl: token.iconUrl,
      coingeckoId: token.coingeckoId,
      coingeckoListingTimestamp: token.coingeckoListingTimestamp,
      comment: null,
      reviewed: false,
    }
  })
}

export function parseDeployedTokens(): DeployedToken[] {
  return tokens.deployedTokens.map((token) => {
    // ethereum+0x3506424F91fD33084466F402d5D97f05F8e3b4AF (CHZ 18)
    const [chain, ...rest] = token.id.split('+')
    // ethereum, 0x3506424F91fD33084466F402d5D97f05F8e3b4AF (CHZ 18)
    const [address, symbol, decimals] =
      rest.join('')?.replace('(', '').replace(')', '')?.split(' ') ?? []
    if (!chain || !address || !symbol || !decimals) {
      throw new Error('Invalid deployed token')
    }

    const abstractTokenId = tokens.abstractTokens
      .find((abstractToken) => {
        return abstractToken.deployedTokens.some(
          (deployedTokenId) => deployedTokenId === token.id,
        )
      })
      ?.id.split(':')[0]

    return {
      chain,
      address,
      abstractTokenId: abstractTokenId ?? null,
      symbol,
      decimals: Number(decimals),
      deploymentTimestamp: token.deploymentTimestamp,
      comment: null,
    }
  })
}
