import {
  assert,
  AggLayerL2Token,
  AmountConfigEntry,
  AssetId,
  ChainConverter,
  ChainId,
  ProjectId,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'
import { chainToProject } from '../backend'
import { BackendProject, BackendProjectEscrow } from '../backend/BackendProject'
import { chains } from '../chains'
import { ethereum } from '../chains/ethereum'
import { ChainConfig } from '../common'
import { tokenList } from '../tokens'
import { AGGLAYER_L2BRIDGE_ADDRESS } from './aggLayer'

export function getTvlAmountsConfig(
  projects: BackendProject[],
): AmountConfigEntry[] {
  const entries: AmountConfigEntry[] = []

  const nonZeroSupplyTokens = tokenList.filter((t) => t.supply !== 'zero')
  for (const token of nonZeroSupplyTokens) {
    const projectAndChain = findProjectAndChain(token, projects)

    const { chain, project } = projectAndChain

    const configEntry = projectTokenToConfigEntry(chain, token, project)

    entries.push(configEntry)
  }

  for (const project of projects) {
    for (const escrow of project.escrows) {
      if (escrow.sharedEscrow?.type === 'AggLayer') {
        for (const token of escrow.tokens) {
          if (token.address === undefined) {
            continue
          }
          const chain = chains.find((x) => x.name === project.projectId)
          assert(chain, `Chain not found for token ${token.id}`)

          const configEntry = projectAggLayerEscrowToConfigEntry(
            chain,
            token,
            escrow,
            project,
          )

          entries.push(configEntry)
        }
        if (escrow.sharedEscrow.nativeAsset === 'etherPreminted') {
          const chain = chains.find((x) => x.name === project.projectId)
          assert(chain, `Chain not found for project ${project.projectId}`)
          assert(
            chain.minTimestampForTvl,
            'Chain should have minTimestampForTvl',
          )

          entries.push({
            type: 'aggLayerNativeEtherPreminted',
            dataSource: `${chain.name}_agglayer`,
            l2BridgeAddress: AGGLAYER_L2BRIDGE_ADDRESS,
            premintedAmount: escrow.sharedEscrow.premintedAmount ?? BigInt(0),
            category: 'ether',
            project: project.projectId,
            chain: chain.name,
            assetId: AssetId.create(ethereum.name, 'native'),
            decimals: 18,
            includeInTotal: true,
            isAssociated: false,
            source: 'canonical',
            symbol: 'ETH',
            sinceTimestamp: UnixTime.max(
              chain.minTimestampForTvl,
              escrow.sinceTimestamp,
            ),
          })
        }
        if (escrow.sharedEscrow.nativeAsset === 'etherWrapped') {
          const chain = chains.find((x) => x.name === project.projectId)
          assert(chain, `Chain not found for project ${project.projectId}`)
          assert(escrow.sharedEscrow.wethAddress, 'WETH address is required')
          assert(
            chain.minTimestampForTvl,
            'Chain should have minTimestampForTvl',
          )
          const l1Weth = tokenList.find(
            (t) => AssetId.create(ethereum.name, t.address) === AssetId.WETH,
          )
          assert(l1Weth, 'Ethereum WETH token not found')

          entries.push({
            type: 'aggLayerNativeEtherWrapped',
            dataSource: `${chain.name}_agglayer`,
            wethAddress: escrow.sharedEscrow.wethAddress,
            category: 'ether',
            project: project.projectId,
            chain: chain.name,
            assetId: AssetId.create(ethereum.name, l1Weth?.address),
            decimals: 18,
            includeInTotal: true,
            isAssociated: false,
            source: 'canonical',
            symbol: 'ETH',
            sinceTimestamp: UnixTime.max(
              chain.minTimestampForTvl,
              escrow.sinceTimestamp,
            ),
          })
        }
        if (escrow.sharedEscrow.includeAllOKBFromL1) {
          const token = tokenList.find(
            (t) =>
              AssetId.create(chainConverter.toName(t.chainId), t.address) ===
              AssetId.OKB,
          )
          assert(token, 'OKB token not found')

          const configEntry = projectEscrowToConfigEntry(
            ethereum,
            { ...token, isPreminted: false },
            escrow,
            project,
          )

          entries.push(configEntry)
        }
      } else {
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

  return entries
}

/** Lighter version of `getTvlAmountsConfig`, does not that much nor enforces full configuration compatibility  */
export function getTvlAmountsConfigForProject(
  project: BackendProject,
): AmountConfigEntry[] {
  const entries: AmountConfigEntry[] = []

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
    for (const token of escrow.tokens) {
      const chain = chains.find((x) => x.chainId === +token.chainId)
      assert(chain, `Chain not found for token ${token.id}`)
      assert(chain.name === escrow.chain, 'Programmer error: chain mismatch')

      const configEntry = projectEscrowToConfigEntry(
        chain,
        token,
        escrow,
        project,
      )

      entries.push(configEntry)
    }
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

    return {
      type: 'totalSupply',
      address: token.address,
      ...getSupplyTokenInfo(chain, token, project),
      ...getBaseTokenInfo(token, project.projectId),
    }
  }

  if (token.supply === 'circulatingSupply') {
    return {
      type: 'circulatingSupply',
      address: token.address ?? 'native',
      coingeckoId: token.coingeckoId,
      ...getSupplyTokenInfo(chain, token, project),
      ...getBaseTokenInfo(token, project.projectId),
    }
  }

  throw new Error('Invalid token supply type')
}

function projectAggLayerEscrowToConfigEntry(
  chain: ChainConfig,
  token: Token & { isPreminted: boolean },
  escrow: BackendProjectEscrow,
  project: BackendProject,
): AggLayerL2Token {
  assert(token.address, 'Token address is required for AggLayer escrow')

  return {
    type: 'aggLayerL2Token',
    originNetwork: 0,
    dataSource: `${chain.name}_agglayer`,
    l1Address: token.address,
    ...getEscrowTokenInfo(chain, token, escrow, project),
    ...getBaseTokenInfo(token, project.projectId),
    assetId: AssetId.create(ethereum.name, token.address),
    chain: project.projectId,
  }
}

function projectEscrowToConfigEntry(
  chain: ChainConfig,
  token: Token & { isPreminted: boolean },
  escrow: BackendProjectEscrow,
  project: BackendProject,
): AmountConfigEntry {
  if (token.isPreminted) {
    return {
      type: 'preminted',
      address: token.address ?? 'native',
      escrowAddress: escrow.address,
      coingeckoId: token.coingeckoId,
      dataSource: `${chain.name}_preminted_${token.address}`,
      ...getEscrowTokenInfo(chain, token, escrow, project),
      ...getBaseTokenInfo(token, project.projectId),
    }
  }

  return {
    type: 'escrow',
    address: token.address ?? 'native',
    escrowAddress: escrow.address,
    dataSource: chain.name,
    ...getEscrowTokenInfo(chain, token, escrow, project),
    ...getBaseTokenInfo(token, project.projectId),
  }
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

function getSupplyTokenInfo(
  chain: ChainConfig,
  token: Token,
  project: BackendProject,
) {
  assert(chain.minTimestampForTvl, 'Chain should have minTimestampForTvl')

  const sinceTimestamp = UnixTime.max(
    chain.minTimestampForTvl,
    token.sinceTimestamp,
  )
  const untilTimestamp = token.untilTimestamp

  const isAssociated = !!project.associatedTokens?.includes(token.symbol)
  const includeInTotal = true
  const source = token.source

  const dataSource =
    token.supply === 'circulatingSupply' ? 'coingecko' : chain.name

  return {
    sinceTimestamp,
    untilTimestamp,
    includeInTotal,
    isAssociated,
    source,
    dataSource,
  }
}

function getEscrowTokenInfo(
  chain: ChainConfig,
  token: Token & { isPreminted: boolean },
  escrow: BackendProjectEscrow,
  project: BackendProject,
) {
  assert(chain.minTimestampForTvl, 'Chain should have minTimestampForTvl')
  const tokenSinceTimestamp = UnixTime.max(
    chain.minTimestampForTvl,
    token.sinceTimestamp,
  )
  const sinceTimestamp = UnixTime.max(
    tokenSinceTimestamp,
    escrow.sinceTimestamp,
  )

  const untilTimestamp = getUntilTimestamp(
    token.untilTimestamp,
    escrow.untilTimestamp,
  )

  const isAssociated = !!project.associatedTokens?.includes(token.symbol)
  const includeInTotal = escrow.includeInTotal ?? true
  const bridgedUsing = escrow.bridgedUsing
  const source = escrow.source ?? 'canonical'

  return {
    sinceTimestamp,
    untilTimestamp,
    includeInTotal: token.excludeFromTotal ? false : includeInTotal,
    isAssociated,
    bridgedUsing,
    source,
  }
}

function getBaseTokenInfo(token: Token, project: ProjectId) {
  return {
    assetId: AssetId.create(
      chainConverter.toName(token.chainId),
      token.address,
    ),
    chain: chainConverter.toName(token.chainId),
    project,
    decimals: token.decimals,
    symbol: token.symbol,
    category: token.category,
  }
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
