import { type ChainConfig, tokenList } from '@l2beat/config'
import { assert, type AmountConfigEntry, type Token } from '@l2beat/shared-pure'
import { keyBy } from 'lodash'
import type { BackendProject, BackendProjectEscrow } from '../BackendProject'
import { getCirculatingSupplyEntry } from './amounts/circulatingSupply'
import { addSharedEscrowsL1Tokens } from './amounts/custom/addSharedEscrowsL1Tokens'
import { aggLayerEscrowToEntries } from './amounts/custom/aggLayerEscrowToEntries'
import { elasticChainEscrowToEntries } from './amounts/custom/elasticChainEscrowToEntries'
import { getEscrowEntry } from './amounts/escrow'
import { getPremintedEntry } from './amounts/preminted'
import { getTotalSupplyEntry } from './amounts/totalSupply'

export function getTvlAmountsConfig(
  projects: BackendProject[],
  chains: ChainConfig[],
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
    p.escrows.flatMap(
      (e) =>
        (e.sharedEscrow?.type === 'AggLayer' &&
          e.sharedEscrow?.tokensToAssignFromL1) ||
        [],
    ),
  )

  const elasticChainIncludedL1Tokens = projects.flatMap((p) =>
    p.escrows.flatMap(
      (e) =>
        (e.sharedEscrow?.type === 'ElasticChain' &&
          e.sharedEscrow?.tokensToAssignFromL1) ||
        [],
    ),
  )

  for (const project of projects) {
    for (const escrow of project.escrows) {
      switch (escrow.sharedEscrow?.type) {
        case 'AggLayer': {
          const aggLayerEntries = aggLayerEscrowToEntries(
            escrow,
            project,
            aggLayerIncludedL1Tokens,
          )
          entries.push(...aggLayerEntries)
          break
        }
        case 'ElasticChain': {
          const elasticChainEntries = elasticChainEscrowToEntries(
            escrow,
            project,
            elasticChainIncludedL1Tokens,
            chains,
          )
          entries.push(...elasticChainEntries)
          break
        }
        default: {
          for (const token of escrow.tokens) {
            const chain = chains.find((x) => x.chainId === +token.chainId)
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
  }

  return addSharedEscrowsL1Tokens(projects, entries, chains)
}

/** Lighter version of `getTvlAmountsConfig`, does not that much nor enforces full configuration compatibility  */
export function getTvlAmountsConfigForProject(
  project: BackendProject,
  chains: ChainConfig[],
): AmountConfigEntry[] {
  const entries: AmountConfigEntry[] = []

  const nonZeroSupplyTokens = tokenList.filter((t) => t.supply !== 'zero')

  const projectTokens = nonZeroSupplyTokens.filter(
    (t) => t.chainId === project.chain?.chainId,
  )

  for (const token of projectTokens) {
    const chain = chains.find((x) => x.chainId === +token.chainId)
    assert(chain, `Chain not found for token ${token.symbol}`)

    const configEntry = projectTokenToConfigEntry(chain, token, project)

    entries.push(configEntry)
  }

  const chainMap = keyBy(chains, (e) => e.chainId)

  for (const escrow of project.escrows) {
    switch (escrow.sharedEscrow?.type) {
      case 'AggLayer': {
        const aggLayerEntries = aggLayerEscrowToEntries(
          escrow,
          project,
          escrow.sharedEscrow.tokensToAssignFromL1 ?? [],
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
        )
        entries.push(...elasticChainEntries)
        break
      }
      default: {
        for (const token of escrow.tokens) {
          const chain = chainMap[+token.chainId]
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
  project: BackendProject,
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
  escrow: BackendProjectEscrow,
  project: BackendProject,
): AmountConfigEntry {
  if (token.isPreminted) {
    return getPremintedEntry(chain, token, escrow, project)
  }
  return getEscrowEntry(chain, token, escrow, project)
}

function findProjectAndChain(token: Token, projects: BackendProject[]) {
  const project = projects.find((x) => x.chain?.chainId === token.chainId)
  assert(project, `Project not found for token ${token.symbol}`)
  const chain = project.chain
  assert(chain, `Chain not found for token ${token.symbol}`)
  return { chain, project }
}
