/*

                         === IMPORTANT REQUIREMENTS ===
                        Please read before adding tokens

L2BEAT cannot and will not track every possible token. Adding a large number of
obscure coins will only introduce noise and unnecessary work while not providing
visible benefits.

You can check the detailed steps on how to add new tokens in the tvl.md file in the repository.
*/

import { ConfigReader, getDiscoveryPaths } from '@l2beat/discovery'
import {
  AssetId,
  assert,
  ChainSpecificAddress,
  type LegacyToken,
  UnixTime,
  unique,
} from '@l2beat/shared-pure'
import uniqBy from 'lodash/uniqBy'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import type { ChainConfig } from '../types'
import generated from './generated.json'
import { GeneratedToken } from './types'

export function getTokenList(chains: ChainConfig[]): LegacyToken[] {
  const tokens: LegacyToken[] = []

  tokens.push(...getGeneratedTokenList(chains))
  tokens.push(...getDiscoveryTokenList(chains))

  return tokens
}

export function getGeneratedTokenList(chains: ChainConfig[]): LegacyToken[] {
  return generated.tokens.map((t) => toToken(GeneratedToken.parse(t), chains))
}

export function getDiscoveryTokenList(chains: ChainConfig[]): LegacyToken[] {
  const tokens: LegacyToken[] = []
  const paths = getDiscoveryPaths()
  const configReader = new ConfigReader(paths.discovery)

  const tokensDiscoveryProjects = configReader.getProjectsInGroup('tokens')

  for (const tokenDiscovery of tokensDiscoveryProjects) {
    const content = configReader.readDiscovery(tokenDiscovery)
    const chainsSupportedByToken = unique(
      content.entries.map(
        (e) => ChainSpecificAddress.longChain(e.address) as string,
      ),
    )

    for (const chain of chains) {
      if (!chainsSupportedByToken.includes(chain.name)) {
        continue
      }

      const discovery = new ProjectDiscovery(tokenDiscovery)
      const tokensFromDiscovery = discovery.get$TokenData()
      for (const token of tokensFromDiscovery) {
        const generatedToken = GeneratedToken.parse(token)
        const formattedToken = toToken(generatedToken, chains)
        tokens.push(formattedToken)
      }
    }
  }

  return uniqBy(tokens, (t) => t.id)
}

function toToken(
  generated: GeneratedToken,
  chains: ChainConfig[],
): LegacyToken {
  const chain = chains.find((c) => c.chainId === +generated.chainId)
  assert(chain, `Chain not found for ${generated.symbol}`)
  assert(
    chain.sinceTimestamp,
    `Token added for chain without sinceTimestamp ${chain.name}`,
  )

  const sinceTimestamp = UnixTime(
    Math.max(
      generated.deploymentTimestamp,
      chain.sinceTimestamp,
      generated.coingeckoListingTimestamp,
    ),
  )

  return {
    id: AssetId.create(chain.name, generated.address),
    ...generated,
    chainName: chain.name,
    url:
      generated.address && chain.explorerUrl
        ? `${chain.explorerUrl}/address/${generated.address}`
        : undefined,
    sinceTimestamp,
  }
}
