import { assert, Env } from '@l2beat/backend-tools'
import {
  Layer2,
  bridges,
  chains,
  layer2s,
  layer3s,
  tokenList,
} from '@l2beat/config'
import {
  AmountConfigEntry,
  ChainId,
  PriceConfigEntry,
  ProjectId,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'

import {
  Project,
  bridgeToProject,
  layer2ToProject,
  layer3ToProject,
} from '../../model/Project'
import { ChainConverter } from '../../tools/ChainConverter'
import { Tvl2Config } from '../Config'
import { FeatureFlags } from '../FeatureFlags'
import { getChainTvlConfig, getChainsWithTokens } from './tvl'

export function getTvl2Config(
  flags: FeatureFlags,
  env: Env,
  minTimestampOverride?: UnixTime,
): Tvl2Config {
  const projects = layer2s
    .map(layer2ToProject)
    .concat(bridges.map(bridgeToProject))
    .concat(layer3s.map(layer3ToProject))

  const chainConverter = new ChainConverter(
    chains.map((x) => ({ name: x.name, chainId: ChainId(x.chainId) })),
  )
  const chainToProject = getChainToProjectMapping(layer2s, chainConverter)

  const chainConfigs = getChainsWithTokens(tokenList, chains).map((chain) =>
    getChainTvlConfig(flags.isEnabled('tvl2', chain), env, chain, {
      minTimestamp: minTimestampOverride,
    }),
  )

  const tvl2Config: Tvl2Config = {
    amounts: getAmountsConfig(
      projects,
      tokenList,
      chainConverter,
      chainToProject,
    ),
    prices: getPricesConfig(tokenList),
    chains: chainConfigs,
    coingeckoApiKey: env.optionalString([
      'COINGECKO_API_KEY_FOR_TVL2',
      'COINGECKO_API_KEY',
    ]),
    chainConverter,
    maxTimestampsToAggregateAtOnce: env.integer(
      'MAX_TIMESTAMPS_TO_AGGREGATE_AT_ONCE',
      100,
    ),
    projects,
    projectsExcludedFromApi:
      env.optionalString('TVL_PROJECTS_EXCLUDED_FROM_API')?.split(' ') ?? [],
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
      if (token.symbol === 'ETH') {
        continue
      }
      const projectId = chainToProject.get(chainConverter.toName(token.chainId))
      assert(projectId, 'Project is required for token')

      const project = projects.find((x) => x.projectId === projectId)
      assert(project, 'Project not found')

      const associatedToken = (project.associatedTokens ?? []).find(
        (t) => t === token.symbol,
      )
      const isAssociated = !!associatedToken

      switch (token.formula) {
        case 'totalSupply':
          assert(token.address, 'Token address is required for total supply')

          entries.push({
            type: 'totalSupply',
            address: token.address,
            chain: chainConverter.toName(token.chainId),
            sinceTimestamp: token.sinceTimestamp,
            project: projectId,
            source: toSource(token.type),
            includeInTotal: true,
            decimals: token.decimals,
            symbol: token.symbol,
            isAssociated,
          })
          break
        case 'circulatingSupply':
          entries.push({
            type: 'circulatingSupply',
            address: token.address ?? 'native',
            chain: chainConverter.toName(token.chainId),
            sinceTimestamp: token.sinceTimestamp,
            coingeckoId: token.coingeckoId,
            project: projectId,
            source: toSource(token.type),
            includeInTotal: true,
            decimals: token.decimals,
            symbol: token.symbol,
            isAssociated,
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
        const associatedToken = (project.associatedTokens ?? []).find(
          (t) => t === token.symbol,
        )
        const isAssociated = !!associatedToken

        entries.push({
          type: 'escrow',
          address: token.address ?? 'native',
          chain: chainConverter.toName(token.chainId),
          sinceTimestamp: UnixTime.max(
            token.sinceTimestamp,
            escrow.sinceTimestamp,
          ),
          untilTimestamp: getUntilTimestamp(
            token.untilTimestamp,
            escrow.untilTimestamp,
          ),
          escrowAddress: escrow.address,
          project: project.projectId,
          source: 'canonical',
          includeInTotal: escrow.includeInTotal ?? true,
          decimals: token.decimals,
          symbol: token.symbol,
          isAssociated,
        })
      }
    }
  }

  return entries
}

function getUntilTimestamp(
  tokenUntil: UnixTime | undefined,
  escrowUntil: UnixTime | undefined,
): UnixTime | undefined {
  if (tokenUntil === undefined && escrowUntil === undefined) {
    return undefined
  }

  if (tokenUntil === undefined) {
    return escrowUntil
  }

  if (escrowUntil === undefined) {
    return tokenUntil
  }

  return UnixTime.max(tokenUntil, escrowUntil)
}

function getPricesConfig(tokenList: Token[]): PriceConfigEntry[] {
  const prices = new Map<string, PriceConfigEntry>()

  for (const token of tokenList) {
    const chain = chains.find((x) => x.chainId === +token.chainId)
    assert(chain, `Chain not found for token ${token.id}`)

    const key = `${chain.name}-${(token.address ?? 'native').toString()}`

    assert(prices.get(key) === undefined, 'Every price should be unique')

    assert(chain.minTimestampForTvl, 'Chain should have minTimestampForTvl')
    const sinceTimestamp = UnixTime.max(
      chain.minTimestampForTvl,
      token.sinceTimestamp,
    )

    prices.set(key, {
      type: 'coingecko',
      assetId: token.id,
      address: token.address ?? 'native',
      chain: chain.name,
      sinceTimestamp,
      coingeckoId: token.coingeckoId,
    })
  }

  return Array.from(prices.values())
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

  for (const project of layer3s) {
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
