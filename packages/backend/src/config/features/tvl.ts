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
import { TvlConfig } from '../Config'
import { FeatureFlags } from '../FeatureFlags'
import { getChainTvlConfig, getChainsWithTokens } from './chains'

export function getTvlConfig(
  flags: FeatureFlags,
  env: Env,
  minTimestampOverride?: UnixTime,
): TvlConfig {
  const projects = layer2s
    .map(layer2ToProject)
    .concat(bridges.map(bridgeToProject))
    .concat(layer3s.map(layer3ToProject))

  const chainConverter = new ChainConverter(
    chains.map((x) => ({ name: x.name, chainId: ChainId(x.chainId) })),
  )
  const chainToProject = getChainToProjectMapping(layer2s, chainConverter)

  const chainConfigs = getChainsWithTokens(tokenList, chains).map((chain) =>
    getChainTvlConfig(flags.isEnabled('tvl', chain), env, chain, {
      minTimestamp: minTimestampOverride,
    }),
  )

  return {
    amounts: getAmountsConfig(
      projects,
      tokenList,
      chainConverter,
      chainToProject,
      minTimestampOverride,
    ),
    prices: getPricesConfig(tokenList, minTimestampOverride),
    chains: chainConfigs,
    coingeckoApiKey: env.optionalString(['COINGECKO_API_KEY']),
    chainConverter,
    maxTimestampsToAggregateAtOnce: env.integer(
      'MAX_TIMESTAMPS_TO_AGGREGATE_AT_ONCE',
      100,
    ),
    projects,
    projectsExcludedFromApi:
      env.optionalString('TVL_PROJECTS_EXCLUDED_FROM_API')?.split(' ') ?? [],
    tvlCleanerEnabled: flags.isEnabled('tvlCleaner'),
  }
}

function getAmountsConfig(
  projects: Project[],
  tokenList: Token[],
  chainConverter: ChainConverter,
  chainToProject: Map<string, ProjectId>,
  minTimestampOverride?: UnixTime,
): AmountConfigEntry[] {
  const entries: AmountConfigEntry[] = []

  for (const token of tokenList) {
    if (token.chainId !== ChainId.ETHEREUM) {
      const projectId = chainToProject.get(chainConverter.toName(token.chainId))
      assert(projectId, 'Project is required for token')

      const project = projects.find((x) => x.projectId === projectId)
      assert(project, 'Project not found')

      const chain = chains.find((x) => x.chainId === +token.chainId)
      assert(chain, `Chain not found for token ${token.id}`)

      assert(chain.minTimestampForTvl, 'Chain should have minTimestampForTvl')
      const chainMinTimestamp = UnixTime.max(
        chain.minTimestampForTvl,
        minTimestampOverride ?? new UnixTime(0),
      )
      const sinceTimestamp = UnixTime.max(
        chainMinTimestamp,
        token.sinceTimestamp,
      )

      const isAssociated = !!project.associatedTokens?.includes(token.symbol)

      switch (token.supply) {
        case 'totalSupply':
          assert(token.address, 'Token address is required for total supply')

          entries.push({
            type: 'totalSupply',
            address: token.address,
            chain: chainConverter.toName(token.chainId),
            sinceTimestamp,
            untilTimestamp: token.untilTimestamp,
            project: projectId,
            source: token.source,
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
            sinceTimestamp,
            untilTimestamp: token.untilTimestamp,
            coingeckoId: token.coingeckoId,
            project: projectId,
            source: token.source,
            includeInTotal: true,
            decimals: token.decimals,
            symbol: token.symbol,
            isAssociated,
          })
          break
        case 'zero':
          break // we do not count supply for zero formula
      }
    }
  }

  for (const project of projects) {
    for (const escrow of project.escrows) {
      for (const token of escrow.tokens) {
        const chain = chains.find((x) => x.chainId === +token.chainId)
        assert(chain, `Chain not found for token ${token.id}`)
        assert(chain.name === escrow.chain, 'Programmer error: chain mismatch')

        assert(chain.minTimestampForTvl, 'Chain should have minTimestampForTvl')
        const chainMinTimestamp = UnixTime.max(
          chain.minTimestampForTvl,
          minTimestampOverride ?? new UnixTime(0),
        )
        const tokenSinceTimestamp = UnixTime.max(
          chainMinTimestamp,
          token.sinceTimestamp,
        )
        const isAssociated = !!project.associatedTokens?.includes(token.symbol)

        entries.push({
          type: 'escrow',
          address: token.address ?? 'native',
          chain: chain.name,
          sinceTimestamp: UnixTime.max(
            tokenSinceTimestamp,
            escrow.sinceTimestamp,
          ),
          untilTimestamp: getUntilTimestamp(
            token.untilTimestamp,
            escrow.untilTimestamp,
          ),
          escrowAddress: escrow.address,
          project: project.projectId,
          source: escrow.source ?? 'canonical',
          includeInTotal: escrow.includeInTotal ?? true,
          decimals: token.decimals,
          symbol: token.symbol,
          isAssociated,
          bridge: escrow.bridge,
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

function getPricesConfig(
  tokenList: Token[],
  minTimestampOverride?: UnixTime,
): PriceConfigEntry[] {
  const prices = new Map<string, PriceConfigEntry>()

  for (const token of tokenList) {
    const chain = chains.find((x) => x.chainId === +token.chainId)
    assert(chain, `Chain not found for token ${token.id}`)

    const key = `${chain.name}-${(token.address ?? 'native').toString()}`

    assert(prices.get(key) === undefined, 'Every price should be unique')

    assert(chain.minTimestampForTvl, 'Chain should have minTimestampForTvl')
    const chainMinTimestamp = UnixTime.max(
      chain.minTimestampForTvl,
      minTimestampOverride ?? new UnixTime(0),
    )
    const sinceTimestamp = UnixTime.max(chainMinTimestamp, token.sinceTimestamp)

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
