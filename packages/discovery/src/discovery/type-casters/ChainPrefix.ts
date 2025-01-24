import type { ContractValue } from '@l2beat/discovery-types'
import { assert, EthereumAddress } from '@l2beat/shared-pure'
import { z } from 'zod'
import { toContractValue } from '../handlers/utils/toContractValue'
import type { ArgType, BaseTypeCaster } from './BaseTypeCaster'

const Validator = z.object({
  prefix: z.string(),
})

export const ChainPrefix: BaseTypeCaster = {
  cast: function (arg: ArgType, incomingValue: ContractValue): ContractValue {
    assert(
      typeof incomingValue === 'string' && EthereumAddress.check(incomingValue),
      'Incoming value must be an EthereumAddress',
    )
    const { prefix } = Validator.parse(arg)

    return toContractValue(`${prefix}:${incomingValue.toString()}`)
  },
}
