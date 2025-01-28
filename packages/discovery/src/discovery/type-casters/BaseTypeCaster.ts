import type { ContractValue } from '@l2beat/discovery-types'

export type ArgType = { [key: string]: string | number | boolean }

export interface BaseTypeCaster {
  cast(arg: ArgType, incomingValue: ContractValue): ContractValue
}
