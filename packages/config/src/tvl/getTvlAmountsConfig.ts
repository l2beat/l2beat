import {
  assert,
  AmountConfigEntry,
  ChainConverter,
  ChainId,
  ProjectId,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'
import { chainToProject } from '../backend'
import { BackendProject, BackendProjectEscrow } from '../backend/BackendProject'
import { chains } from '../chains'
import { ChainConfig } from '../common'
import { tokenList } from '../tokens'

export function getTvlAmountsConfig(
  projects: BackendProject[],
): AmountConfigEntry[] {
  const entries: AmountConfigEntry[] = []

  const nonZeroSupplyTokens = tokenList.filter((t) => t.supply !== 'zero')
  for (const token of nonZeroSupplyTokens) {
    const { chain, project } = findProjectAndChain(token, projects)

    switch (token.supply) {
      case 'totalSupply':
        assert(token.address, 'Token address is required for total supply')
        entries.push({
          type: 'totalSupply',
          address: token.address,
          ...getSupplyTokenInfo(chain, token, project),
          ...getBaseTokenInfo(token, project.projectId),
        })
        break
      case 'circulatingSupply':
        entries.push({
          type: 'circulatingSupply',
          address: token.address ?? 'native',
          coingeckoId: token.coingeckoId,
          ...getSupplyTokenInfo(chain, token, project),
          ...getBaseTokenInfo(token, project.projectId),
        })
        break
    }
  }

  for (const project of projects) {
    for (const escrow of project.escrows) {
      for (const token of escrow.tokens) {
        const chain = chains.find((x) => x.chainId === +token.chainId)
        assert(chain, `Chain not found for token ${token.id}`)
        assert(chain.name === escrow.chain, 'Programmer error: chain mismatch')

        if (token.isPreminted) {
          entries.push({
            type: 'preminted',
            address: token.address ?? 'native',
            escrowAddress: escrow.address,
            coingeckoId: token.coingeckoId,
            dataSource: `${chain.name}_preminted_${token.address}`,
            ...getEscrowTokenInfo(chain, token, escrow, project),
            ...getBaseTokenInfo(token, project.projectId),
          })
        } else {
          entries.push({
            type: 'escrow',
            address: token.address ?? 'native',
            escrowAddress: escrow.address,
            dataSource: chain.name,
            ...getEscrowTokenInfo(chain, token, escrow, project),
            ...getBaseTokenInfo(token, project.projectId),
          })
        }
      }
    }
  }

  return entries
}

const chainConverter = new ChainConverter(
  chains.map((x) => ({ name: x.name, chainId: ChainId(x.chainId) })),
)

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
  const bridge = escrow.bridge
  const source = escrow.source ?? 'canonical'

  return {
    sinceTimestamp,
    untilTimestamp,
    includeInTotal: token.excludeFromTotal ? false : includeInTotal,
    isAssociated,
    bridge,
    source,
  }
}

function getBaseTokenInfo(token: Token, project: ProjectId) {
  return {
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
