import { UpgradeabilityParameters } from './proxies/types'

export interface ProjectParameters {
  name: string
  blockNumber: number
  contracts: ContractParameters[]
}

export interface ContractParameters {
  name: string
  address: string
  upgradeability: UpgradeabilityParameters
  values?: Record<string, ContractValue>
}

export type ContractValue =
  | string
  | number
  | boolean
  | (string | number | boolean)[]
