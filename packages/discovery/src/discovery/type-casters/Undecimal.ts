import { ContractValue } from '@l2beat/discovery-types'
import { ArgType, BaseTypeCaster } from './BaseTypeCaster'
import { assert } from '@l2beat/backend-tools'
import { z } from 'zod'

const Validator = z.object({
    decimals: z.number()
})

export const Undecimal: BaseTypeCaster = {
    cast: function(arg: ArgType, incomingValue: ContractValue): ContractValue {
        assert(typeof incomingValue === 'number')
        const validated = Validator.parse(arg)
        return incomingValue / Math.pow(10, validated.decimals)
    }
}
