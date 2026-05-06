import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

import type { IProvider } from '../../provider/IProvider'
import type { Handler, HandlerResult } from '../Handler'
import { toContractValue } from '../utils/toContractValue'

export type GhoBucketCapacityHandlerDefinition = v.infer<
  typeof GhoBucketCapacityHandlerDefinition
>
export const GhoBucketCapacityHandlerDefinition = v.strictObject({
  type: v.literal('ghoBucketCapacity'),
  ghoToken: v.string(),
})

const GET_FACILITATOR_ABI =
  'function getFacilitator(address) view returns (tuple(uint128 bucketCapacity, uint128 bucketLevel, string label))'

export class GhoBucketCapacityHandler implements Handler {
  readonly dependencies: string[] = []

  constructor(
    readonly field: string,
    private readonly definition: GhoBucketCapacityHandlerDefinition,
    _abi: string[],
  ) {}

  getMethod(): string {
    return 'ghoBucketCapacity'
  }

  async execute(
    provider: IProvider,
    address: ChainSpecificAddress,
  ): Promise<HandlerResult> {
    const chain = ChainSpecificAddress.chain(address)
    const ghoToken = ChainSpecificAddress(
      `${chain}:${this.definition.ghoToken}`,
    )

    const result = await provider.callMethod<unknown>(
      ghoToken,
      GET_FACILITATOR_ABI,
      [ChainSpecificAddress.address(address)],
    )
    if (result === undefined || result === null) {
      return {
        field: this.field,
        error: `getFacilitator(${address}) reverted on ${ghoToken}`,
      }
    }

    const value = toContractValue(result)
    let cap: unknown
    if (Array.isArray(value)) {
      cap = value[0]
    } else if (typeof value === 'object' && value !== null) {
      cap = (value as Record<string, unknown>).bucketCapacity
    } else {
      cap = value
    }

    if (typeof cap === 'bigint')
      return { field: this.field, value: cap.toString() }
    if (typeof cap === 'number')
      return { field: this.field, value: cap.toString() }
    if (typeof cap === 'string') return { field: this.field, value: cap }
    return {
      field: this.field,
      error: `Could not extract bucketCapacity from getFacilitator return on ${ghoToken}`,
    }
  }
}
