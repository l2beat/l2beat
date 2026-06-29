import { assert, formatSeconds } from '@l2beat/shared-pure'
import type { ContractValue } from '../output/types'
import type { ArgType, BaseTypeCaster } from './BaseTypeCaster'

export const FormatSeconds: BaseTypeCaster = {
  cast: function (_arg: ArgType, incomingValue: ContractValue): ContractValue {
    const value = incomingValue as ContractValue | bigint
    if (typeof value === 'bigint') {
      if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
        return `more than ${formatSeconds(Number.MAX_SAFE_INTEGER)}`
      }
      return formatSeconds(Number(value))
    }
    assert(typeof value === 'number')
    return formatSeconds(value)
  },
}
