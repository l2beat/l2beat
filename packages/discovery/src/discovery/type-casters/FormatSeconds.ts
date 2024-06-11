import { ContractValue } from '@l2beat/discovery-types'
import { ArgType, BaseTypeCaster } from './BaseTypeCaster'
import { assert } from '@l2beat/backend-tools'
import { formatSeconds } from '@l2beat/shared-pure'

export const FormatSeconds: BaseTypeCaster = {
    cast: function(_arg: ArgType, incomingValue: ContractValue): ContractValue {
        assert(typeof incomingValue === 'number')
        return formatSeconds(incomingValue)
    }
}
