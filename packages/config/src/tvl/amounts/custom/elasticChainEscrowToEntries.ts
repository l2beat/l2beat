import { assert, AmountConfigEntry, AssetId } from '@l2beat/shared-pure'
import { BackendProject, BackendProjectEscrow } from '../../../backend'
import { chains } from '../../../chains'
import { ethereum } from '../../../chains/ethereum'
import { tokenList } from '../../../tokens'
import { getElasticChainEtherEntry } from '../elasticChainEther'
import { getElasticChainL2TokenEntry } from '../elasticChainL2Tokens'

export function elasticChainEscrowToEntries(
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
