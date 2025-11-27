import { assert, formatSeconds } from '@l2beat/shared-pure'
import type { ContractValue } from '../output/types.js'
import type { ArgType, BaseTypeCaster } from './BaseTypeCaster.js'

export const FormatSeconds: BaseTypeCaster = {
  cast: function (_arg: ArgType, incomingValue: ContractValue): ContractValue {
    assert(typeof incomingValue === 'number')
    return formatSeconds(incomingValue)
  },
}
