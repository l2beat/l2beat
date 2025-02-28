import type { ContractValue } from '@l2beat/discovery-types'

export interface ProxyDetails {
  type: string
  values: Record<string, ContractValue | undefined>
}
