import type {
  OssificationInput,
  ProjectOssificationContract,
} from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { isDeepStrictEqual } from 'util'

export function mergeOssificationInputs(
  inputs: OssificationInput[],
): OssificationInput | undefined {
  const first = inputs.at(0)
  if (first === undefined) return undefined
  const byAddress = new Map<string, ProjectOssificationContract>()
  for (const contract of inputs.flatMap((input) => input.contracts)) {
    const seen = byAddress.get(contract.address)
    assert(
      seen === undefined || isDeepStrictEqual(seen, contract),
      `${contract.address} differs between the discoveries that share it`,
    )
    byAddress.set(contract.address, contract)
  }
  const contracts = [...byAddress.values()]
  if (contracts.length === 0) return undefined

  return {
    contracts,
    // TODO(L2B-15037): update ids of a shared module's changes are not in the
    // project's discoveryUpdates.
    changes: inputs.flatMap((input) => input.changes),
    resets: inputs.flatMap((input) => input.resets),
    observedSince: Math.min(...inputs.map((input) => input.observedSince)),
  }
}
