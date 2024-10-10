import { assert, AmountConfigEntry, AssetId } from '@l2beat/shared-pure'
import { BackendProject, chainConverter } from '../../../backend'
import { ethereum } from '../../../chains/ethereum'
import { tokenList } from '../../../tokens'
import { getEscrowEntry } from '../escrow'

export function handleOKBentries(
  projectWithOKBConfig: BackendProject[],
  entries: AmountConfigEntry[],
) {
  assert(projectWithOKBConfig.length === 1)
  const okbToken = tokenList.find(
    (t) =>
      AssetId.create(chainConverter.toName(t.chainId), t.address) ===
      AssetId.OKB,
  )
  assert(okbToken)

  const escrow = projectWithOKBConfig[0].escrows.find(
    (e) =>
      e.sharedEscrow?.type === 'AggLayer' &&
      e.sharedEscrow?.includeAllOKBFromL1,
  )
  assert(escrow)

  const l1OKBEntry = getEscrowEntry(
    ethereum,
    okbToken,
    escrow,
    projectWithOKBConfig[0],
  )

  entries.push(l1OKBEntry)

  return entries.filter(
    (e) => e.type !== 'aggLayerL2Token' || e.assetId !== AssetId.OKB,
  )
}
