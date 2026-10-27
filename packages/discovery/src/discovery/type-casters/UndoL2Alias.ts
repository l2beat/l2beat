import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import { toContractValue } from '../handlers/utils/toContractValue'
import type { ContractValue } from '../output/types'
import type { ArgType, BaseTypeCaster } from './BaseTypeCaster'

const ALIAS_OFFSET = 0x1111000000000000000000000000000000001111n
const ADDRESS_MODULUS = 1n << 160n

export const UndoL2Alias: BaseTypeCaster = {
  cast: function (_arg: ArgType, incomingValue: ContractValue): ContractValue {
    assert(
      typeof incomingValue === 'string' &&
        ChainSpecificAddress.check(incomingValue),
      'Incoming value must be a chain specific address',
    )
    const alias = ChainSpecificAddress(incomingValue)
    const aliasNumber = BigInt(ChainSpecificAddress.address(alias))
    const original =
      (aliasNumber - ALIAS_OFFSET + ADDRESS_MODULUS) % ADDRESS_MODULUS

    return toContractValue(
      ChainSpecificAddress.from(
        'eth',
        '0x' + original.toString(16).padStart(40, '0'),
      ).toString(),
    )
  },
}
