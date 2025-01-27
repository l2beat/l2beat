import type { ContractValue } from '@l2beat/discovery-types'
import { assert } from '@l2beat/shared-pure'
import { z } from 'zod'
import type { ArgType, BaseTypeCaster } from './BaseTypeCaster'

const Validator = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean()]),
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
