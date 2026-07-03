import { assert } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { ContractValue } from '../output/types'
import type { ArgType, BaseTypeCaster } from './BaseTypeCaster'

// Decodes a variable-length `bytes` hex value into its UTF-8 string. Use for
// onchain `bytes` fields that hold human-readable text (e.g. JSON config blobs)
// so they are stored decoded rather than as opaque hex. Returns the original
// value if it is not valid UTF-8.
export const BytesToString: BaseTypeCaster = {
  cast: function (_arg: ArgType, incomingValue: ContractValue): ContractValue {
    assert(
      typeof incomingValue === 'string' && incomingValue.startsWith('0x'),
      'Value must be a hex string',
    )

    try {
      return utils.toUtf8String(incomingValue)
    } catch {
      return incomingValue
    }
  },
}
