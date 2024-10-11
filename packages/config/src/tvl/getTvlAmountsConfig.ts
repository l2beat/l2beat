import {
  assert,
  AmountConfigEntry,
  ChainConverter,
  ChainId,
  Token,
} from '@l2beat/shared-pure'
import { chainToProject } from '../backend'
import { BackendProject, BackendProjectEscrow } from '../backend/BackendProject'
import { chains } from '../chains'
import { ChainConfig } from '../common'
import { tokenList } from '../tokens'
import { getCirculatingSupplyEntry } from './amounts/circulatingSupply'
import { aggLayerEscrowToEntries } from './amounts/custom/aggLayerEscrowToEntries'
import { elasticChainEscrowToEntries } from './amounts/custom/elasticChainEscrowToEntries'
import { handleL1Tokens } from './amounts/custom/handleL1Tokens'
import { getEscrowEntry } from './amounts/escrow'
import { getPremintedEntry } from './amounts/preminted'
import { getTotalSupplyEntry } from './amounts/totalSupply'

export function getTvlAmountsConfig(
  projects: BackendProject[],
): AmountConfigEntry[] {
  let entries: AmountConfigEntry[] = []

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
        (e.sharedEscrow?.type === 'ElasticChian' &&
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
        case 'ElasticChian': {
          const elasticChainEntries = elasticChainEscrowToEntries(
            escrow,
            project,
            elasticChainIncludedL1Tokens,
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

  const projectsWithL1Tokens = projects.filter((p) =>
    p.escrows.some(
      (e) =>
        (e.sharedEscrow?.type === 'AggLayer' ||
          e.sharedEscrow?.type === 'ElasticChian') &&
        e.sharedEscrow?.tokensToAssignFromL1?.length &&
        e.sharedEscrow.tokensToAssignFromL1.length > 0,
    ),
  )

  if (projectsWithL1Tokens.length > 0) {
    entries = handleL1Tokens(projectsWithL1Tokens, entries)
  }

  return entries
}

/** Lighter version of `getTvlAmountsConfig`, does not that much nor enforces full configuration compatibility  */
export function getTvlAmountsConfigForProject(
  project: BackendProject,
): AmountConfigEntry[] {
  let entries: AmountConfigEntry[] = []

  const nonZeroSupplyTokens = tokenList.filter((t) => t.supply !== 'zero')

  const projectTokens = nonZeroSupplyTokens.filter(
    (t) =>
      chainToProject.get(chainConverter.toName(t.chainId)) ===
      project.projectId,
  )

  for (const token of projectTokens) {
    const chain = chains.find((x) => x.chainId === +token.chainId)
    assert(chain, `Chain not found for token ${token.symbol}`)

    const configEntry = projectTokenToConfigEntry(chain, token, project)

    entries.push(configEntry)
  }

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
      case 'ElasticChian': {
        const elasticChainEntries = elasticChainEscrowToEntries(
          escrow,
          project,
          escrow.sharedEscrow.tokensToAssignFromL1 ?? [],
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

  if (
    project.escrows.some(
      (e) =>
        e.sharedEscrow?.tokensToAssignFromL1?.length &&
        e.sharedEscrow.tokensToAssignFromL1.length > 0,
    )
  ) {
    entries = handleL1Tokens([project], entries)
  }

  return entries
}

const chainConverter = new ChainConverter(
  chains.map((x) => ({ name: x.name, chainId: ChainId(x.chainId) })),
)

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
  const projectId = chainToProject.get(chainConverter.toName(token.chainId))
  assert(projectId, `Project is required for token ${token.symbol}`)

  const project = projects.find((x) => x.projectId === projectId)
  assert(project, `Project not found for token ${token.symbol}`)

  const chain = chains.find((x) => x.chainId === +token.chainId)

  assert(chain, `Chain not found for token ${token.symbol}`)

  return { chain, project }
}
