import type { ContractValue } from '../output/types'

export interface ProxyDetails {
  type: string
  values: Record<string, ContractValue | undefined>
}
