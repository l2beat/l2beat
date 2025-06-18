import { assert } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { ContractValue } from '../output/types'
import type { ArgType, BaseTypeCaster } from './BaseTypeCaster'

const Validator = v.record(
  v.string(),
  v.union([v.string(), v.number(), v.boolean()]),
)

export const Mapping: BaseTypeCaster = {
  cast: function (arg: ArgType, incomingValue: ContractValue): ContractValue {
    assert(
      typeof incomingValue === 'number' || typeof incomingValue === 'string',
    )
    const validated = Validator.parse(arg)
    const mapped = validated[incomingValue.toString()]
    if (mapped === undefined) {
      return incomingValue
    }

    return mapped
  },
}
