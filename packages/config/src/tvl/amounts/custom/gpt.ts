import { assert, AmountConfigEntry, AssetId } from '@l2beat/shared-pure'
import { BackendProject, chainConverter } from '../../../backend'
import { ethereum } from '../../../chains/ethereum'
import { tokenList } from '../../../tokens'
import { getEscrowEntry } from '../escrow'

export function handleGPTentries(
  projectWithGPTConfig: BackendProject[],
  entries: AmountConfigEntry[],
) {
  assert(projectWithGPTConfig.length === 1)
  const gptToken = tokenList.find(
    (t) =>
      AssetId.create(chainConverter.toName(t.chainId), t.address) ===
      AssetId.GPT,
  )
  assert(gptToken)

  const escrow = projectWithGPTConfig[0].escrows.find(
    (e) =>
      e.sharedEscrow?.type === 'AggLayer' &&
      e.sharedEscrow?.includeAllGPTFromL1,
  )
  assert(escrow)

  const l1GPTEntry = getEscrowEntry(
    ethereum,
    gptToken,
    escrow,
    projectWithGPTConfig[0],
  )

  entries.push(l1GPTEntry)

  return entries.filter(
    (e) => e.type !== 'aggLayerL2Token' || e.assetId !== AssetId.GPT,
  )
}
