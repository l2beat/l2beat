import tokens from './tokens.json'
import type { AbstractToken, DeployedToken } from './types'

export const chains: string[] = [
  'ethereum',
  'polygon',
  'arbitrum',
  'optimism',
  'bsc',
  'avalanche',
  'celo',
  'linea',
  'base',
  'polygonzkevm',
  'gnosis',
  'zksync2',
  'sepolia',
  'scroll',
  'mantle',
  'metis',
  'bobanetwork',
  'mode',
  'zora',
  'mantapacific',
  'blast',
  'kinto',
  'katana',
  'unichain',
  'ink',
  'everclear',
  'zircuit',
  'taiko',
  'facet',
]

function parseAbstractTokens(): AbstractToken[] {
  return tokens.abstractTokens.map((token) => {
    const [id, rest] = token.id.split(':')
    const [issuer, symbol] = rest?.split('.') ?? []

    if (!id || !symbol) {
      throw new Error('Invalid abstract token')
    }

    return {
      id,
      issuer,
      symbol,
      category: token.category as AbstractToken['category'],
      iconUrl: token.iconUrl,
      coingeckoId: token.coingeckoId,
      coingeckoListingTimestamp: new Date(
        token.coingeckoListingTimestamp * 1000,
      ),
    }
  })
}

export const abstractTokens: AbstractToken[] = parseAbstractTokens()

function parseDeployedTokens(): DeployedToken[] {
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
      id: `${chain}-${address}`,
      chain,
      address,
      abstractTokenId,
      symbol,
      decimals: Number(decimals),
      deploymentTimestamp: new Date(token.deploymentTimestamp * 1000),
    }
  })
}

export const deployedTokens: DeployedToken[] = parseDeployedTokens()
