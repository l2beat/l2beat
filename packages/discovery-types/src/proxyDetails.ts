import type { ContractValue } from './Discovery'

export interface ProxyDetails {
  type: string
  values: Record<string, ContractValue | undefined>
}
