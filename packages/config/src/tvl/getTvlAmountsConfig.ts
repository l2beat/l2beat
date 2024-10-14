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

  const chainMap: Record<number, ChainConfig> = {}
  for (const chain of chains) {
    chainMap[chain.chainId] = chain
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

  const projectsWithZKCroConfig = projects.filter((p) =>
    p.escrows.some(
      (e) =>
        e.sharedEscrow?.type === 'ElasticChian' &&
        e.sharedEscrow?.includeAllzkCROFromL1,
    ),
  )

  if (projectsWithZKCroConfig.length > 0) {
    entries = handleZKCROentries(projectsWithZKCroConfig, entries)
  }

  const projectsWithOKBConfig = projects.filter((p) =>
    p.escrows.some(
      (e) =>
        e.sharedEscrow?.type === 'AggLayer' &&
        e.sharedEscrow?.includeAllOKBFromL1,
    ),
  )

  if (projectsWithOKBConfig.length > 0) {
    entries = handleOKBentries(projectsWithOKBConfig, entries)
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

  const chainMap: Record<number, ChainConfig> = {}
  for (const chain of chains) {
    chainMap[chain.chainId] = chain
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

  if (
    project.escrows.some(
      (e) =>
        e.sharedEscrow?.type === 'AggLayer' &&
        e.sharedEscrow?.includeAllOKBFromL1,
    )
  ) {
    entries = handleOKBentries([project], entries)
  }

  if (
    project.escrows.some(
      (e) =>
        e.sharedEscrow?.type === 'ElasticChian' &&
        e.sharedEscrow?.includeAllzkCROFromL1,
    )
  ) {
    entries = handleZKCROentries([project], entries)
  }

  return entries
}

const chainConverter = new ChainConverter(
  chains.map((x) => ({ name: x.name, chainId: ChainId(x.chainId) })),
)

function handleOKBentries(
  projectWithOKBConfig: BackendProject[],
  entries: AmountConfigEntry[],
) {
  assert(projectWithOKBConfig.length === 1)
  const okbToken = tokenList.find(
    (t) =>
      AssetId.create(chainConverter.toName(t.chainId), t.address) ===
      AssetId.OKB,
  )
  assert(okbToken)

  const escrow = projectWithOKBConfig[0].escrows.find(
    (e) =>
      e.sharedEscrow?.type === 'AggLayer' &&
      e.sharedEscrow?.includeAllOKBFromL1,
  )
  assert(escrow)

  const l1OKBEntry = getEscrowEntry(
    ethereum,
    okbToken,
    escrow,
    projectWithOKBConfig[0],
  )

  entries.push(l1OKBEntry)

  return entries.filter(
    (e) => e.type !== 'aggLayerL2Token' || e.assetId !== AssetId.OKB,
  )
}

function handleZKCROentries(
  projectWithZKCroConfig: BackendProject[],
  entries: AmountConfigEntry[],
) {
  assert(projectWithZKCroConfig.length === 1)
  const zkCROToken = tokenList.find(
    (t) =>
      AssetId.create(chainConverter.toName(t.chainId), t.address) ===
      AssetId.ZKCRO,
  )
  assert(zkCROToken)

  const escrow = projectWithZKCroConfig[0].escrows.find(
    (e) =>
      e.sharedEscrow?.type === 'ElasticChian' &&
      e.sharedEscrow?.includeAllzkCROFromL1,
  )
  assert(escrow)

  const l1ZKCroEntry = getEscrowEntry(
    ethereum,
    zkCROToken,
    escrow,
    projectWithZKCroConfig[0],
  )

  entries.push(l1ZKCroEntry)

  return entries.filter(
    (e) => e.type !== 'elasticChainL2Token' || e.assetId !== AssetId.ZKCRO,
  )
}

function aggLayerEscrowToEntries(
  escrow: BackendProjectEscrow,
  project: BackendProject,
) {
  assert(escrow.sharedEscrow?.type === 'AggLayer', 'AggLayer escrow expected')
  const entries: AmountConfigEntry[] = []

  for (const token of escrow.tokens) {
    if (token.address === undefined) {
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

  for (const token of escrow.tokens) {
    if (token.address === undefined) {
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
