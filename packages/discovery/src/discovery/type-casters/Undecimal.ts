import { ContractValue } from '@l2beat/discovery-types'
import { ArgType, BaseTypeCaster } from './BaseTypeCaster'
import { assert } from '@l2beat/backend-tools'
import { z } from 'zod'
import { BigNumber } from 'ethers'
import { toContractValue } from '../handlers/utils/toContractValue'

const Validator = z.object({
    decimals: z.number()
})

export const Undecimal: BaseTypeCaster = {
    cast: function(arg: ArgType, incomingValue: ContractValue): ContractValue {
        assert(typeof incomingValue === 'number' || typeof incomingValue === 'string', 'Incoming value must be a number or a string')
        const validated = Validator.parse(arg)
        const asBigInt = BigNumber.from(incomingValue)
        const decimals = BigNumber.from(validated.decimals)
        const base = BigNumber.from(10)

        return toContractValue(asBigInt.div(base.pow(decimals)))
    }
}
