import {
  assert,
  AmountConfigEntry,
  AssetId,
  ChainConverter,
  ChainId,
  Token,
} from '@l2beat/shared-pure'
import { chainToProject } from '../backend'
import { BackendProject, BackendProjectEscrow } from '../backend/BackendProject'
import { chains } from '../chains'
import { ethereum } from '../chains/ethereum'
import { ChainConfig } from '../common'
import { tokenList } from '../tokens'
import { getAggLayerL2TokenEntry } from './amounts/aggLayerL2Tokens'
import { getAggLayerNativeEtherPremintedEntry } from './amounts/aggLayerNativeEtherPreminted'
import { getAggLayerNativeEtherWrappedEntry } from './amounts/aggLayerNativeEtherWrapped'
import { getCirculatingSupplyEntry } from './amounts/circulatingSupply'
import { getElasticChainEtherEntry } from './amounts/elasticChainEther'
import { getElasticChainL2TokenEntry } from './amounts/elasticChainL2Tokens'
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

  for (const project of projects) {
    for (const escrow of project.escrows) {
      switch (escrow.sharedEscrow?.type) {
        case 'AggLayer': {
          const aggLayerEntries = aggLayerEscrowToEntries(escrow, project)
          entries.push(...aggLayerEntries)
          break
        }
        case 'ElasticChian': {
          const elasticChainEntries = elasticChainEscrowToEntries(
            escrow,
            project,
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
        e.sharedEscrow?.includeL1Tokens?.length &&
        e.sharedEscrow.includeL1Tokens.length > 0,
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
        const aggLayerEntries = aggLayerEscrowToEntries(escrow, project)
        entries.push(...aggLayerEntries)
        break
      }
      case 'ElasticChian': {
        const elasticChainEntries = elasticChainEscrowToEntries(escrow, project)
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
        e.sharedEscrow?.includeL1Tokens?.length &&
        e.sharedEscrow.includeL1Tokens.length > 0,
    )
  ) {
    entries = handleL1Tokens([project], entries)
  }

  return entries
}

const chainConverter = new ChainConverter(
  chains.map((x) => ({ name: x.name, chainId: ChainId(x.chainId) })),
)

export function handleL1Tokens(
  projectsWithL1Tokens: BackendProject[],
  entries: AmountConfigEntry[],
) {
  for (const project of projectsWithL1Tokens) {
    const escrow = project.escrows.find(
      (e) =>
        (e.sharedEscrow?.type === 'AggLayer' ||
          e.sharedEscrow?.type === 'ElasticChian') &&
        e.sharedEscrow?.includeL1Tokens?.length &&
        e.sharedEscrow.includeL1Tokens.length > 0,
    )
    assert(escrow)
    assert(escrow.sharedEscrow?.includeL1Tokens)

    for (const tokenSymbol of escrow.sharedEscrow.includeL1Tokens) {
      const token = escrow.tokens.find((t) => t.symbol === tokenSymbol)
      assert(token, `Token ${tokenSymbol} not found in escrow tokens`)

      const l1TokenEntry = getEscrowEntry(ethereum, token, escrow, project)

      entries.push(l1TokenEntry)
    }
  }

  return entries
}

function aggLayerEscrowToEntries(
  escrow: BackendProjectEscrow,
  project: BackendProject,
) {
  assert(escrow.sharedEscrow?.type === 'AggLayer', 'AggLayer escrow expected')
  const entries: AmountConfigEntry[] = []

  const l1Tokens = escrow.sharedEscrow.includeL1Tokens

  for (const token of escrow.tokens) {
    if (token.address === undefined || l1Tokens?.includes(token.symbol)) {
      continue
    }
    const chain = chains.find((x) => x.chainId === +token.chainId)
    assert(chain, `Chain not found for token ${token.id}`)
    assert(chain.name === escrow.chain, 'Programmer error: chain mismatch')

    const configEntry = getAggLayerL2TokenEntry(chain, token, escrow, project)

    entries.push(configEntry)
  }
  if (escrow.sharedEscrow.nativeAsset === 'etherPreminted') {
    const chain = chains.find((x) => x.name === project.projectId)
    assert(chain, `Chain not found for project ${project.projectId}`)
    assert(chain.minTimestampForTvl, 'Chain should have minTimestampForTvl')

    const configEntry = getAggLayerNativeEtherPremintedEntry(
      chain,
      escrow,
      project,
    )

    entries.push(configEntry)
  }
  if (escrow.sharedEscrow.nativeAsset === 'etherWrapped') {
    const chain = chains.find((x) => x.name === project.projectId)
    assert(chain, `Chain not found for project ${project.projectId}`)
    assert(chain.minTimestampForTvl, 'Chain should have minTimestampForTvl')
    const l1Weth = tokenList.find(
      (t) => AssetId.create(ethereum.name, t.address) === AssetId.WETH,
    )
    assert(l1Weth, 'Ethereum WETH token not found')

    const configEntry = getAggLayerNativeEtherWrappedEntry(
      chain,
      l1Weth,
      escrow,
      project,
    )

    entries.push(configEntry)
  }

  return entries
}

function elasticChainEscrowToEntries(
  escrow: BackendProjectEscrow,
  project: BackendProject,
) {
  assert(
    escrow.sharedEscrow?.type === 'ElasticChian',
    'ElasticChian escrow expected',
  )
  const entries: AmountConfigEntry[] = []

  const l1Tokens = escrow.sharedEscrow.includeL1Tokens

  for (const token of escrow.tokens) {
    if (token.address === undefined || l1Tokens?.includes(token.symbol)) {
      continue
    }
    const chain = chains.find((x) => x.chainId === +token.chainId)
    assert(chain, `Chain not found for token ${token.id}`)
    assert(chain.name === escrow.chain, 'Programmer error: chain mismatch')

    const configEntry = getElasticChainL2TokenEntry(
      chain,
      token,
      escrow,
      project,
    )

    entries.push(configEntry)
  }

  const ether = tokenList.find(
    (t) => AssetId.create(ethereum.name, t.address) === AssetId.ETH,
  )
  assert(ether, 'ETH on ethereum not found')

  const etherEntry = getElasticChainEtherEntry(
    ethereum,
    { ...ether, address: escrow.sharedEscrow.l2EtherAddress },
    escrow,
    project,
  )
  entries.push(etherEntry)

  return entries
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
  const projectId = chainToProject.get(chainConverter.toName(token.chainId))
  assert(projectId, `Project is required for token ${token.symbol}`)

  const project = projects.find((x) => x.projectId === projectId)
  assert(project, `Project not found for token ${token.symbol}`)

  const chain = chains.find((x) => x.chainId === +token.chainId)

  assert(chain, `Chain not found for token ${token.symbol}`)

  return { chain, project }
}
