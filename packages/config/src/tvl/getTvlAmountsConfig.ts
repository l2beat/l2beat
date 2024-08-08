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
import { BackendProject } from '../backend/BackendProject'
import { chains } from '../chains'
import { tokenList } from '../tokens'

export function getTvlAmountsConfig(
  projects: BackendProject[],
  minTimestampOverride?: UnixTime,
): AmountConfigEntry[] {
  const entries: AmountConfigEntry[] = []

  for (const token of tokenList) {
    if (token.supply !== 'zero') {
      const projectId = chainToProject.get(chainConverter.toName(token.chainId))
      assert(projectId, `Project is required for token ${token.symbol}`)
      const project = projects.find((x) => x.projectId === projectId)
      assert(project, `Project not found for token ${token.symbol}`)

      const chain = chains.find((x) => x.chainId === +token.chainId)
      assert(chain, `Chain not found for token ${token.symbol}`)

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
            sinceTimestamp,
            untilTimestamp: token.untilTimestamp,
            includeInTotal: true,
            isAssociated,
            source: token.source,
            dataSource: chain.name,
            ...getBaseTokenInfo(token, project.projectId),
          })
          break
        case 'circulatingSupply':
          entries.push({
            type: 'circulatingSupply',
            address: token.address ?? 'native',
            coingeckoId: token.coingeckoId,
            sinceTimestamp,
            untilTimestamp: token.untilTimestamp,
            includeInTotal: true,
            isAssociated,
            source: token.source,
            dataSource: 'coingecko',
            ...getBaseTokenInfo(token, project.projectId),
          })
          break
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

        const untilTimestamp = getUntilTimestamp(
          token.untilTimestamp,
          escrow.untilTimestamp,
        )
        const sinceTimestamp = UnixTime.max(
          tokenSinceTimestamp,
          escrow.sinceTimestamp,
        )
        const isAssociated = !!project.associatedTokens?.includes(token.symbol)
        const includeInTotal = escrow.includeInTotal ?? true

        if (token.isPreminted) {
          entries.push({
            type: 'preminted',
            address: token.address ?? 'native',
            escrowAddress: escrow.address,
            coingeckoId: token.coingeckoId,
            dataSource: `${chain.name}_preminted_${token.address}`,
            sinceTimestamp,
            untilTimestamp,
            includeInTotal,
            isAssociated,
            bridge: escrow.bridge,
            source: escrow.source ?? 'canonical',
            ...getBaseTokenInfo(token, project.projectId),
          })
        } else {
          entries.push({
            type: 'escrow',
            address: token.address ?? 'native',
            escrowAddress: escrow.address,
            dataSource: chain.name,
            sinceTimestamp,
            untilTimestamp,
            includeInTotal,
            isAssociated,
            bridge: escrow.bridge,
            source: escrow.source ?? 'canonical',
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
