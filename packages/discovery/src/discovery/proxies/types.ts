import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { ContractValue } from '../output/types.js'
import type { ContractDeployment } from '../provider/IProvider.js'

export interface ProxyDetails {
  type: string
  values: Record<string, ContractValue | undefined>
}

export type ProxyResult = {
  addresses: ChainSpecificAddress[]
  deployment: ContractDeployment | undefined
} & ProxyDetails
