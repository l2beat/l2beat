import { assert } from '@l2beat/backend-tools'
import { ContractValue } from '@l2beat/discovery-types'
import { formatSeconds } from '@l2beat/shared-pure'
import { ArgType, BaseTypeCaster } from './BaseTypeCaster'

export const FormatSeconds: BaseTypeCaster = {
  cast: function (_arg: ArgType, incomingValue: ContractValue): ContractValue {
    assert(typeof incomingValue === 'number')
    return formatSeconds(incomingValue)
  },
}
