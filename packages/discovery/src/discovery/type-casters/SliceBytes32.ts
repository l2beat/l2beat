import { assert } from '@l2beat/shared-pure'
import type { ContractValue } from '../output/types'
import type { ArgType, BaseTypeCaster } from './BaseTypeCaster'

const ZERO_BYTES32 = '0x' + '0'.repeat(64)

export const SliceBytes32: BaseTypeCaster = {
  cast: function (arg: ArgType, incomingValue: ContractValue): ContractValue {
    assert(typeof incomingValue === 'string', 'Value must be a hex string')
    if (!incomingValue.startsWith('0x')) {
      return 'UNRESOLVED'
    }

    const offset = Number(arg.offset)
    assert(!Number.isNaN(offset), 'offset must be a number')

    const hex = incomingValue.slice(2)
    const start = offset * 2
    const end = start + 64
    if (end > hex.length || hex.length === 0) {
      return 'UNRESOLVED'
    }

    const value = '0x' + hex.slice(start, end)
    if (value === ZERO_BYTES32) {
      return 'UNRESOLVED'
    }
    return value
  },
}
