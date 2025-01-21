import type { ContractValue } from '@l2beat/discovery-types'
import { assert, formatSeconds } from '@l2beat/shared-pure'
import type { ArgType, BaseTypeCaster } from './BaseTypeCaster'

export const FormatSeconds: BaseTypeCaster = {
  cast: function (_arg: ArgType, incomingValue: ContractValue): ContractValue {
    assert(typeof incomingValue === 'number')
    return formatSeconds(incomingValue)
  },
}
