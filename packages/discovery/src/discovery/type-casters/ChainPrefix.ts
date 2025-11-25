import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { toContractValue } from '../handlers/utils/toContractValue.js'
import type { ContractValue } from '../output/types.js'
import type { ArgType, BaseTypeCaster } from './BaseTypeCaster.js'

const Validator = v.object({
  prefix: v.string(),
})

export const ChainPrefix: BaseTypeCaster = {
  cast: function (arg: ArgType, incomingValue: ContractValue): ContractValue {
    assert(
      typeof incomingValue === 'string' &&
        ChainSpecificAddress.check(incomingValue),
      'Incoming value must be an EthereumAddress',
    )
    const { prefix } = Validator.parse(arg)

    return toContractValue(
      ChainSpecificAddress.from(
        prefix,
        ChainSpecificAddress.address(ChainSpecificAddress(incomingValue)),
      ).toString(),
    )
  },
}
