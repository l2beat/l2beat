import { assert } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { BigNumber } from 'bignumber.js'
import { toContractValue } from '../handlers/utils/toContractValue'
import type { ContractValue } from '../output/types'
import type { ArgType, BaseTypeCaster } from './BaseTypeCaster'

const Validator = v.object({
  decimals: v.number(),
})

export const Undecimal: BaseTypeCaster = {
  cast: function (arg: ArgType, incomingValue: ContractValue): ContractValue {
    assert(
      typeof incomingValue === 'number' || typeof incomingValue === 'string',
      'Incoming value must be a number or a string',
    )
    const validated = Validator.parse(arg)
    const asBigInt = BigNumber(incomingValue)
    const decimals = BigNumber(validated.decimals)
    const base = BigNumber(10)

    return toContractValue(asBigInt.div(base.pow(decimals)).toFormat())
  },
}
