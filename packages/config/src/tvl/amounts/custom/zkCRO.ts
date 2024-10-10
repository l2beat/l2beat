import { assert, AmountConfigEntry, AssetId } from '@l2beat/shared-pure'
import { BackendProject, chainConverter } from '../../../backend'
import { ethereum } from '../../../chains/ethereum'
import { tokenList } from '../../../tokens'
import { getEscrowEntry } from '../escrow'

export function handleZKCROentries(
  projectWithZKCroConfig: BackendProject[],
  entries: AmountConfigEntry[],
) {
  assert(projectWithZKCroConfig.length === 1)
  const zkCROToken = tokenList.find(
    (t) =>
      AssetId.create(chainConverter.toName(t.chainId), t.address) ===
      AssetId.ZKCRO,
  )
  assert(zkCROToken)

  const escrow = projectWithZKCroConfig[0].escrows.find(
    (e) =>
      e.sharedEscrow?.type === 'ElasticChian' &&
      e.sharedEscrow?.includeAllzkCROFromL1,
  )
  assert(escrow)

  const l1ZKCroEntry = getEscrowEntry(
    ethereum,
    zkCROToken,
    escrow,
    projectWithZKCroConfig[0],
  )

  entries.push(l1ZKCroEntry)

  return entries.filter(
    (e) => e.type !== 'elasticChainL2Token' || e.assetId !== AssetId.ZKCRO,
  )
}
