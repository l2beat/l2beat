import type { ContractValue } from '@l2beat/discovery-types'
import { assert } from '@l2beat/shared-pure'
import { BigNumber } from 'bignumber.js'
import { z } from 'zod'
import { toContractValue } from '../handlers/utils/toContractValue'
import type { ArgType, BaseTypeCaster } from './BaseTypeCaster'

const Validator = z.object({
  value: z.number(),
  trueResult: z.union([z.number(), z.string()]).optional(),
  falseResult: z.union([z.number(), z.string()]).optional(),
})

export const GreaterThan: BaseTypeCaster = {
  cast: function (arg: ArgType, incomingValue: ContractValue): ContractValue {
    assert(
      typeof incomingValue === 'number' || typeof incomingValue === 'string',
      'Incoming value must be a number or a string',
    )
    const validated = Validator.parse(arg)
    const asBigInt = BigNumber(incomingValue)
    const compareValue = BigNumber(validated.value)

    if (asBigInt.gt(compareValue)) {
      return toContractValue(validated.trueResult ?? true)
    } else {
      return toContractValue(validated.falseResult ?? false)
    }
  },
}
