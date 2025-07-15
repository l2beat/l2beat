import { assert, formatSeconds } from '@l2beat/shared-pure'
import type { ContractValue } from '../output/types'
import type { ArgType } from './BaseTypeCaster'

export const TimeSince = {
  cast: function (_arg: ArgType, incomingValue: ContractValue): ContractValue {
    assert(typeof incomingValue === 'number', 'Incoming value must be a number')
    // TODO: possibly use the block timestamp instead of Date.now()
    const now = Math.floor(Date.now() / 1000)
    const diff = now - incomingValue
    return formatSeconds(diff)
  },
}
