import { assert, AmountConfigEntry, AssetId } from '@l2beat/shared-pure'
import { BackendProject, BackendProjectEscrow } from '../../../backend'
import { chains } from '../../../chains'
import { ethereum } from '../../../chains/ethereum'
import { tokenList } from '../../../tokens'
import { getAggLayerL2TokenEntry } from '../aggLayerL2Tokens'
import { getAggLayerNativeEtherPremintedEntry } from '../aggLayerNativeEtherPreminted'
import { getAggLayerNativeEtherWrappedEntry } from '../aggLayerNativeEtherWrapped'

export function aggLayerEscrowToEntries(
  escrow: BackendProjectEscrow,
  project: BackendProject,
  aggLayerIncludedL1Tokens: string[],
) {
  assert(escrow.sharedEscrow?.type === 'AggLayer', 'AggLayer escrow expected')
  const entries: AmountConfigEntry[] = []

  for (const token of escrow.tokens) {
    if (
      token.address === undefined ||
      aggLayerIncludedL1Tokens?.includes(token.symbol)
    ) {
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
