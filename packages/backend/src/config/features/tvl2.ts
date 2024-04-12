import { assert, Env } from '@l2beat/backend-tools'
import { bridges, chains, Layer2, layer2s, tokenList } from '@l2beat/config'
import {
  AmountConfigEntry,
  ChainId,
  PriceConfigEntry,
  ProjectId,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'

import { bridgeToProject, layer2ToProject, Project } from '../../model/Project'
import { ChainConverter } from '../../tools/ChainConverter'
import { Tvl2Config } from '../Config'
import { FeatureFlags } from '../FeatureFlags'
import { getChainsWithTokens, getChainTvlConfig } from './tvl'

export function getTvl2Config(
  flags: FeatureFlags,
  env: Env,
  minTimestampOverride?: UnixTime,
): Tvl2Config {
  const projects = layer2s
    .map(layer2ToProject)
    .concat(bridges.map(bridgeToProject))

  const chainConverter = new ChainConverter(
    chains.map((x) => ({ name: x.name, chainId: ChainId(x.chainId) })),
  )
  const chainToProject = getChainToProjectMapping(layer2s, chainConverter)

  const chainConfigs = getChainsWithTokens(tokenList, chains).map((chain) =>
    getChainTvlConfig(flags.isEnabled('tvl2', chain), env, chain, {
      minTimestamp: minTimestampOverride,
    }),
  )

  const tvl2Config = {
    amounts: getAmountsConfig(
      projects,
      tokenList,
      chainConverter,
      chainToProject,
    ),
    prices: getPricesConfig(tokenList, chainConverter),
    chains: chainConfigs,
    coingeckoApiKey: env.optionalString([
      'COINGECKO_API_KEY_FOR_TVL2',
      'COINGECKO_API_KEY',
    ]),
  }

  return tvl2Config
}

function getAmountsConfig(
  projects: Project[],
  tokenList: Token[],
  chainConverter: ChainConverter,
  chainToProject: Map<string, ProjectId>,
): AmountConfigEntry[] {
  const entries: AmountConfigEntry[] = []

  for (const token of tokenList) {
    if (token.chainId !== ChainId.ETHEREUM) {
      const project = chainToProject.get(chainConverter.toName(token.chainId))
      assert(project, 'Project is required for token')

      switch (token.formula) {
        case 'totalSupply':
          assert(token.address, 'Token address is required for total supply')

          entries.push({
            type: 'totalSupply',
            address: token.address,
            chain: chainConverter.toName(token.chainId),
            sinceTimestamp: token.sinceTimestamp,
            project,
            source: toSource(token.type),
            includeInTotal: true,
          })
          break
        case 'circulatingSupply':
          entries.push({
            type: 'circulatingSupply',
            address: token.address ?? 'native',
            chain: chainConverter.toName(token.chainId),
            sinceTimestamp: token.sinceTimestamp,
            coingeckoId: token.coingeckoId,
            project,
            source: toSource(token.type),
            includeInTotal: true,
          })
          break
        case 'locked':
          throw new Error('Locked tokens are derived from projects list')
      }
    }
  }

  for (const project of projects) {
    for (const escrow of project.escrows) {
      for (const token of escrow.tokens) {
        entries.push({
          type: 'escrow',
          address: token.address ?? 'native',
          chain: chainConverter.toName(token.chainId),
          sinceTimestamp: token.sinceTimestamp,
          escrowAddress: escrow.address,
          project: project.projectId,
          source: toSource(token.type),
          includeInTotal: true,
        })
      }
    }
  }

  return entries
}

function getPricesConfig(
  tokenList: Token[],
  chainConverter: ChainConverter,
): PriceConfigEntry[] {
  const uniqueEntries = new Map<string, PriceConfigEntry>()

  for (const token of tokenList) {
    const chain = chainConverter.toName(token.chainId)
    const key = `${chain}-${(token.address ?? 'native').toString()}`
    const curr = uniqueEntries.get(key)

    if (curr === undefined) {
      uniqueEntries.set(key, {
        type: 'coingecko',
        address: token.address ?? 'native',
        chain: chain,
        sinceTimestamp: token.sinceTimestamp,
        coingeckoId: token.coingeckoId,
      })
    } else {
      if (token.sinceTimestamp.lt(curr.sinceTimestamp)) {
        uniqueEntries.set(key, {
          type: 'coingecko',
          address: token.address ?? 'native',
          chain: chain,
          sinceTimestamp: token.sinceTimestamp,
          coingeckoId: token.coingeckoId,
        })
      }
    }
  }

  return Array.from(uniqueEntries.values())
}

function getChainToProjectMapping(
  layer2s: Layer2[],
  chainConverter: ChainConverter,
) {
  const chainToProject = new Map<string, ProjectId>()

  for (const project of layer2s) {
    if (project.chainConfig) {
      const chain = chainConverter.toName(ChainId(project.chainConfig.chainId))
      chainToProject.set(chain, project.id)
    }
  }

  return chainToProject
}

function toSource(
  type: 'CBV' | 'EBV' | 'NMV',
): 'native' | 'canonical' | 'external' {
  switch (type) {
    case 'CBV':
      return 'canonical'
    case 'EBV':
      return 'external'
    case 'NMV':
      return 'native'
  }
}
