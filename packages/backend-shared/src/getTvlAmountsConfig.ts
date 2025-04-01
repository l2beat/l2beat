import type { ChainConfig, Project, ProjectTvlEscrow } from '@l2beat/config'
import { assert, type AmountConfigEntry, type Token } from '@l2beat/shared-pure'
import { getCirculatingSupplyEntry } from './amounts/circulatingSupply'
import { addSharedEscrowsL1Tokens } from './amounts/custom/addSharedEscrowsL1Tokens'
import { aggLayerEscrowToEntries } from './amounts/custom/aggLayerEscrowToEntries'
import { elasticChainEscrowToEntries } from './amounts/custom/elasticChainEscrowToEntries'
import { getEscrowEntry } from './amounts/escrow'
import { getPremintedEntry } from './amounts/preminted'
import { getTotalSupplyEntry } from './amounts/totalSupply'

export function getTvlAmountsConfig(
  projects: Project<'tvlConfig', 'chainConfig' | 'isArchived'>[],
  chains: ChainConfig[],
  tokenList: Token[],
): AmountConfigEntry[] {
  const entries: AmountConfigEntry[] = []

  const nonZeroSupplyTokens = tokenList.filter((t) => t.supply !== 'zero')
  for (const token of nonZeroSupplyTokens) {
    const projectAndChain = findProjectAndChain(token, projects)

    const { chain, project } = projectAndChain

    const configEntry = projectTokenToConfigEntry(chain, token, project)

    entries.push(configEntry)
  }

  const aggLayerIncludedL1Tokens = projects.flatMap((p) =>
    p.tvlConfig.escrows.flatMap(
      (e) =>
        (e.sharedEscrow?.type === 'AggLayer' &&
          e.sharedEscrow?.tokensToAssignFromL1) ||
        [],
    ),
  )

  const elasticChainIncludedL1Tokens = projects.flatMap((p) =>
    p.tvlConfig.escrows.flatMap(
      (e) =>
        (e.sharedEscrow?.type === 'ElasticChain' &&
          e.sharedEscrow?.tokensToAssignFromL1) ||
        [],
    ),
  )

  for (const project of projects) {
    for (const escrow of project.tvlConfig.escrows) {
      switch (escrow.sharedEscrow?.type) {
        case 'AggLayer': {
          if (project.isArchived) break
          const aggLayerEntries = aggLayerEscrowToEntries(
            escrow,
            project,
            aggLayerIncludedL1Tokens,
            tokenList,
          )
          entries.push(...aggLayerEntries)
          break
        }
        case 'ElasticChain': {
          if (project.isArchived) break
          const elasticChainEntries = elasticChainEscrowToEntries(
            escrow,
            project,
            elasticChainIncludedL1Tokens,
            chains,
            tokenList,
          )
          entries.push(...elasticChainEntries)
          break
        }
        default: {
          for (const token of escrow.tokens) {
            const chain = chains.find((x) => x.name === token.chainName)
            assert(chain, `Chain not found for token ${token.id}`)
            assert(
              chain.name === escrow.chain,
              'Programmer error: chain mismatch',
            )

            if (chain.name === project.id) {
              if (project.isArchived) break
            }

            const configEntry = projectEscrowToConfigEntry(
              chain,
              token,
              escrow,
              project,
            )

            entries.push(configEntry)
          }
        }
      }
    }
  }

  return addSharedEscrowsL1Tokens(projects, entries, chains)
}

/** Lighter version of `getTvlAmountsConfig`, does not that much nor enforces full configuration compatibility  */
export function getTvlAmountsConfigForProject(
  project: Project<'tvlConfig', 'chainConfig'>,
  chains: ChainConfig[],
  tokenList: Token[],
): AmountConfigEntry[] {
  const entries: AmountConfigEntry[] = []

  const nonZeroSupplyTokens = tokenList.filter((t) => t.supply !== 'zero')

  const projectTokens = nonZeroSupplyTokens.filter(
    (t) => t.chainName === project.chainConfig?.name,
  )

  for (const token of projectTokens) {
    const chain = chains.find((x) => x.name === token.chainName)
    assert(chain, `Chain not found for token ${token.symbol}`)

    const configEntry = projectTokenToConfigEntry(chain, token, project)

    entries.push(configEntry)
  }

  const chainMap: Record<string, ChainConfig> = {}
  for (const chain of chains) {
    chainMap[chain.name] = chain
  }

  for (const escrow of project.tvlConfig.escrows) {
    switch (escrow.sharedEscrow?.type) {
      case 'AggLayer': {
        const aggLayerEntries = aggLayerEscrowToEntries(
          escrow,
          project,
          escrow.sharedEscrow.tokensToAssignFromL1 ?? [],
          tokenList,
        )
        entries.push(...aggLayerEntries)
        break
      }
      case 'ElasticChain': {
        const elasticChainEntries = elasticChainEscrowToEntries(
          escrow,
          project,
          escrow.sharedEscrow.tokensToAssignFromL1 ?? [],
          chains,
          tokenList,
        )
        entries.push(...elasticChainEntries)
        break
      }
      default: {
        for (const token of escrow.tokens) {
          const chain = chainMap[token.chainName]
          assert(chain, `Chain not found for token ${token.id}`)
          assert(
            chain.name === escrow.chain,
            'Programmer error: chain mismatch',
          )

          const configEntry = projectEscrowToConfigEntry(
            chain,
            token,
            escrow,
            project,
          )

          entries.push(configEntry)
        }
      }
    }
  }

  return addSharedEscrowsL1Tokens([project], entries, chains)
}

function projectTokenToConfigEntry(
  chain: ChainConfig,
  token: Token,
  project: Project<'tvlConfig', 'chainConfig'>,
): AmountConfigEntry {
  if (token.supply === 'totalSupply') {
    assert(token.address, 'Token address is required for total supply')

    return getTotalSupplyEntry(chain, token, project)
  }

  if (token.supply === 'circulatingSupply') {
    return getCirculatingSupplyEntry(chain, token, project)
  }

  throw new Error('Invalid token supply type')
}

function projectEscrowToConfigEntry(
  chain: ChainConfig,
  token: Token & { isPreminted: boolean },
  escrow: ProjectTvlEscrow,
  project: Project<'tvlConfig', 'chainConfig'>,
): AmountConfigEntry {
  if (token.isPreminted) {
    return getPremintedEntry(chain, token, escrow, project)
  }
  return getEscrowEntry(chain, token, escrow, project)
}

function findProjectAndChain(
  token: Token,
  projects: Project<'tvlConfig', 'chainConfig'>[],
) {
  const project = projects.find((x) => x.chainConfig?.name === token.chainName)
  assert(project, `Project not found for token ${token.symbol}`)
  const chain = project.chainConfig
  assert(chain, `Chain not found for token ${token.symbol}`)
  return { chain, project }
}
