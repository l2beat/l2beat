import { assert } from '@l2beat/shared-pure'
import { valueToBigInt } from '../handlers/utils/valueToBigInt'
import type { ContractValue } from '../output/types'
import type { ArgType, BaseTypeCaster } from './BaseTypeCaster'

const MAX_BYTES4 = 0xffffffffn
const BLOCK_DEPTH_MASK = 0xffffn
const WAIT_FOR_SAFE_FLAG = 0x00010000n

export const CCIPAllowedFinality: BaseTypeCaster = {
  cast: function (_arg: ArgType, incomingValue: ContractValue): ContractValue {
    assert(
      typeof incomingValue === 'string' || typeof incomingValue === 'number',
      'Value must be a bytes4 hex string or number',
    )

    const value = valueToBigInt(incomingValue)
    assert(value >= 0n && value <= MAX_BYTES4, 'Value must fit in bytes4')

    const flags = value >> 16n
    const unknownFlags = flags & ~1n

    return {
      raw: `0x${value.toString(16).padStart(8, '0')}`,
      fullFinalityAllowed: true,
      safeHeadAllowed: (value & WAIT_FOR_SAFE_FLAG) !== 0n,
      blockDepthsAllowed: (value & BLOCK_DEPTH_MASK) !== 0n,
      minimumBlockDepth: Number(value & BLOCK_DEPTH_MASK),
      unassignedFlags: `0x${unknownFlags.toString(16).padStart(4, '0')}`,
    }
  },
}
