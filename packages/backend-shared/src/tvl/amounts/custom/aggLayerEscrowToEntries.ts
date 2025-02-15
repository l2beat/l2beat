import { tokenList } from '@l2beat/config'
import { assert, type AmountConfigEntry, AssetId } from '@l2beat/shared-pure'
import type {
  BackendProject,
  BackendProjectEscrow,
} from '../../../BackendProject'
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
    const chain = project.chain
    assert(chain, `Missing chain for: ${project.projectId}`)
    const configEntry = getAggLayerL2TokenEntry(chain, token, escrow, project)

    entries.push(configEntry)
  }
  if (escrow.sharedEscrow.nativeAsset === 'etherPreminted') {
    const chain = project.chain
    assert(chain, `Missing chain for: ${project.projectId}`)
    assert(chain.minTimestampForTvl, 'Chain should have minTimestampForTvl')

    const configEntry = getAggLayerNativeEtherPremintedEntry(
      chain,
      escrow,
      project,
    )

    entries.push(configEntry)
  }
  if (escrow.sharedEscrow.nativeAsset === 'etherWrapped') {
    const chain = project.chain
    assert(chain, `Missing chain for: ${project.projectId}`)
    assert(chain.minTimestampForTvl, 'Chain should have minTimestampForTvl')
    const l1Weth = tokenList.find(
      (t) => AssetId.create('ethereum', t.address) === AssetId.WETH,
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
