import { ContractValue } from '@l2beat/discovery-types'
import { ArgType, BaseTypeCaster } from './BaseTypeCaster'
import { assert } from '@l2beat/backend-tools'

export const FormatSeconds: BaseTypeCaster = {
    cast: function(_arg: ArgType, incomingValue: ContractValue): ContractValue {
        assert(typeof incomingValue === 'number')
        return new Date(incomingValue * 1000).toISOString()
    }
}
