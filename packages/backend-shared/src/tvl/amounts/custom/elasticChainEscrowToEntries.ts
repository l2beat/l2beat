import { type ChainConfig, tokenList } from '@l2beat/config'
import {
  assert,
  type AmountConfigEntry,
  AssetId,
  ChainId,
} from '@l2beat/shared-pure'
import type {
  BackendProject,
  BackendProjectEscrow,
} from '../../../BackendProject'
import { getElasticChainEtherEntry } from '../elasticChainEther'
import { getElasticChainL2TokenEntry } from '../elasticChainL2Tokens'

export function elasticChainEscrowToEntries(
  escrow: BackendProjectEscrow,
  project: BackendProject,
  elasticChainIncludedL1Tokens: string[],
  chains: ChainConfig[],
) {
  assert(
    escrow.sharedEscrow?.type === 'ElasticChain',
    'ElasticChain escrow expected',
  )
  const entries: AmountConfigEntry[] = []

  for (const token of escrow.tokens) {
    if (
      token.address === undefined ||
      elasticChainIncludedL1Tokens?.includes(token.symbol)
    ) {
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
    (t) => AssetId.create('ethereum', t.address) === AssetId.ETH,
  )
  assert(ether, 'ETH on ethereum not found')
  const ethereum = chains.find((x) => x.chainId === ChainId.ETHEREUM)
  assert(ethereum !== undefined)

  const etherEntry = getElasticChainEtherEntry(
    ethereum,
    { ...ether, address: escrow.sharedEscrow.l2EtherAddress },
    escrow,
    project,
  )
  entries.push(etherEntry)

  return entries
}
