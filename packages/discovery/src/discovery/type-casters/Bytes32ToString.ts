import { assert } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { ContractValue } from '../output/types'
import type { ArgType, BaseTypeCaster } from './BaseTypeCaster'

export const Bytes32ToString: BaseTypeCaster = {
  cast: function (_arg: ArgType, incomingValue: ContractValue): ContractValue {
    assert(typeof incomingValue === 'string', 'Value must be a hex string')
    assert(
      incomingValue.startsWith('0x') && incomingValue.length === 66,
      'Value must be a bytes32 hex string',
    )

    try {
      return utils.parseBytes32String(incomingValue)
    } catch {
      return incomingValue
    }
  },
}
