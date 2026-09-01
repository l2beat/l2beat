import { formatSeconds } from '@l2beat/shared-pure'
import { valueToBigInt } from '../handlers/utils/valueToBigInt'
import type { ContractValue } from '../output/types'
import type { ArgType, BaseTypeCaster } from './BaseTypeCaster'

export const FormatSeconds = {
  cast: function (
    _arg: ArgType,
    incomingValue: ContractValue | bigint,
  ): ContractValue {
    if (typeof incomingValue === 'number') {
      return formatSeconds(incomingValue)
    }
    const seconds = valueToBigInt(incomingValue)
    if (seconds > BigInt(Number.MAX_SAFE_INTEGER)) {
      return `more than ${formatSeconds(Number.MAX_SAFE_INTEGER)}`
    }
    return formatSeconds(Number(seconds))
  },
} satisfies BaseTypeCaster
