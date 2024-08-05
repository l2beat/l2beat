import {
  assert,
  AmountConfigEntry,
  ChainConverter,
  ChainId,
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
  const chainConverter = new ChainConverter(
    chains.map((x) => ({ name: x.name, chainId: ChainId(x.chainId) })),
  )

  const entries: AmountConfigEntry[] = []

  for (const token of tokenList) {
    if (token.supply !== 'zero') {
      const projectId =
        token.project ??
        chainToProject.get(chainConverter.toName(token.chainId))
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
            chain: chainConverter.toName(token.chainId),
            sinceTimestamp,
            untilTimestamp: token.untilTimestamp,
            project: projectId,
            source: token.source,
            dataSource: chainConverter.toName(token.chainId),
            includeInTotal: true,
            decimals: token.decimals,
            symbol: token.symbol,
            isAssociated,
            category: token.category,
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
            dataSource: 'coingecko',
            includeInTotal: true,
            decimals: token.decimals,
            symbol: token.symbol,
            isAssociated,
            category: token.category,
          })
          break
        case 'preminted':
          assert(token.address, 'Token address is required for preminted')
          assert(token.escrow, 'Escrows are required for preminted')

          entries.push({
            type: 'preminted',
            address: token.address,
            escrowAddress: token.escrow,
            chain: chainConverter.toName(token.chainId),
            sinceTimestamp,
            untilTimestamp: token.untilTimestamp,
            coingeckoId: token.coingeckoId,
            project: projectId,
            dataSource: `${chainConverter.toName(token.chainId)}_preminted_${
              token.address
            }`,
            source: token.source,
            // TODO
            includeInTotal: true,
            decimals: token.decimals,
            symbol: token.symbol,
            isAssociated,
            category: token.category,
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
          dataSource: chain.name,
          source: escrow.source ?? 'canonical',
          includeInTotal: escrow.includeInTotal ?? true,
          decimals: token.decimals,
          symbol: token.symbol,
          isAssociated,
          bridge: escrow.bridge,
          category: token.category,
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
