import { assert } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { BigNumber } from 'bignumber.js'
import { toContractValue } from '../handlers/utils/toContractValue'
import type { ContractValue } from '../output/types'
import type { ArgType, BaseTypeCaster } from './BaseTypeCaster'

const Validator = v.object({
  value: v.union([v.number(), v.string()]),
  trueResult: v.union([v.number(), v.string()]).optional(),
  falseResult: v.union([v.number(), v.string()]).optional(),
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
    }
    return toContractValue(validated.falseResult ?? false)
  },
}
