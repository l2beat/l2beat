import type { OssificationContract, OssificationHistory } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { isDeepStrictEqual } from 'util'

export function mergeOssificationHistories(
  histories: OssificationHistory[],
): OssificationHistory | undefined {
  const byAddress = new Map<string, OssificationContract>()
  for (const contract of histories.flatMap((history) => history.contracts)) {
    const seen = byAddress.get(contract.address)
    assert(
      seen === undefined || isDeepStrictEqual(seen, contract),
      `${contract.address} differs between the discoveries that share it`,
    )
    byAddress.set(contract.address, contract)
  }
  const contracts = [...byAddress.values()].sort(
    (a, b) => b.ossifyingSince - a.ossifyingSince,
  )
  if (contracts.length === 0) return undefined

  return {
    contracts,
    // TODO(L2B-15037): update ids of a shared module's changes are not in the
    // project's discoveryUpdates.
    changes: histories
      .flatMap((history) => history.changes)
      .sort((a, b) => a.timestamp - b.timestamp),
    arrivals: histories
      .flatMap((history) => history.arrivals)
      .sort((a, b) => a - b),
    observedSince: Math.min(
      ...histories.map((history) => history.observedSince),
    ),
  }
}
