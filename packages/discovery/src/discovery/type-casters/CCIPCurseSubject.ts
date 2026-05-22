import { assert } from '@l2beat/shared-pure'
import type { ContractValue } from '../output/types'
import type { ArgType, BaseTypeCaster } from './BaseTypeCaster'

// CCIP curse subjects are bytes16 with two recognized shapes. The global
// sentinel is non-zero on both ends so it can't collide with a per-chain
// subject (whose top 8 bytes are always zero):
//
//   global: [01 00..00 01]                       -> 'GLOBAL_CURSE'
//   chain:  [00..00 | uint64 chainSelector]      -> decimal string
//            <-8B-->   <-------8B------->
const GLOBAL_CURSE_SUBJECT = '0x01000000000000000000000000000001'

export const CCIPCurseSubject: BaseTypeCaster = {
  cast: function (_arg: ArgType, incomingValue: ContractValue): ContractValue {
    assert(
      typeof incomingValue === 'string',
      'Value must be a bytes16 hex string',
    )
    const hex = incomingValue.toLowerCase()
    assert(hex.startsWith('0x') && hex.length === 34, 'Value must be 16 bytes')

    if (hex === GLOBAL_CURSE_SUBJECT) {
      return 'GLOBAL_CURSE'
    }

    const top = hex.slice(2, 18)
    const bottom = hex.slice(18)
    if (top !== '0000000000000000') {
      return incomingValue
    }
    return BigInt('0x' + bottom).toString()
  },
}
