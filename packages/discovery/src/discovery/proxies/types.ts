import type { ContractValue } from '../utils/types'

export interface ProxyDetails {
  type: string
  values: Record<string, ContractValue | undefined>
}
