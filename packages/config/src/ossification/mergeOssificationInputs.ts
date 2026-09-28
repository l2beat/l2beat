import { assert } from '@l2beat/shared-pure'
import uniqBy from 'lodash/uniqBy'
import type { OssificationInput } from './OssificationInput'

export function mergeOssificationInputs(
  inputs: OssificationInput[],
): OssificationInput | undefined {
  const first = inputs.at(0)
  if (first === undefined) return undefined
  assert(
    inputs.every((input) => input.now === first.now),
    'merged perimeters are measured at one time',
  )

  return {
    now: first.now,
    contracts: uniqBy(
      inputs.flatMap((input) => input.contracts),
      (contract) => contract.address,
    ),
    changes: inputs.flatMap((input) => input.changes),
    resets: inputs.flatMap((input) => input.resets),
    observedSince: Math.min(...inputs.map((input) => input.observedSince)),
  }
}
