import { assert, PremintedEntry, Token } from '@l2beat/shared-pure'
import { BackendProject, BackendProjectEscrow } from '../../backend'
import { ChainConfig } from '../../common'
import { getEscrowEntry } from './escrow'

export function getPremintedEntry(
  chain: ChainConfig,
  token: Token & { isPreminted: boolean },
  escrow: BackendProjectEscrow,
  project: BackendProject,
): PremintedEntry {
  assert(token.isPreminted)

  return {
    ...getEscrowEntry(chain, token, escrow, project),
    type: 'preminted',
    address: token.address ?? 'native',
    escrowAddress: escrow.address,
    coingeckoId: token.coingeckoId,
    dataSource: `${chain.name}_preminted_${token.address}`,
  }
}
