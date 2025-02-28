import type { ContractValue } from '../utils/types'

export type ArgType = { [key: string]: string | number | boolean }

export interface BaseTypeCaster {
  cast(arg: ArgType, incomingValue: ContractValue): ContractValue
}
