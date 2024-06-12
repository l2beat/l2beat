import { assert } from '@l2beat/backend-tools'
import { ContractValue } from '@l2beat/discovery-types'
import { BigNumber } from 'ethers'
import { z } from 'zod'
import { toContractValue } from '../handlers/utils/toContractValue'
import { ArgType, BaseTypeCaster } from './BaseTypeCaster'

const Validator = z.object({
  decimals: z.number(),
})

export const Undecimal: BaseTypeCaster = {
  cast: function (arg: ArgType, incomingValue: ContractValue): ContractValue {
    assert(
      typeof incomingValue === 'number' || typeof incomingValue === 'string',
      'Incoming value must be a number or a string',
    )
    const validated = Validator.parse(arg)
    const asBigInt = BigNumber.from(incomingValue)
    const decimals = BigNumber.from(validated.decimals)
    const base = BigNumber.from(10)

    return toContractValue(asBigInt.div(base.pow(decimals)))
  },
}
