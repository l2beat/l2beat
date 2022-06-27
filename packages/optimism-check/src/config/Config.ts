export type Parameter = ConstantParameter | FixedParameter | VariableParameter

export interface ConstantParameter {
  type: 'constant'
  name: string
  description?: string
  value: string | number
}

export interface FixedParameter {
  type: 'fixed'
  name: string
  description?: string
  abi: string
}

export interface VariableParameter {
  type: 'variable'
  name: string
  description?: string
  abi: string
}

export interface ContractDescription {
  expectedAddress?: string
  dependencies?: string[]
  parameters?: Parameter[]
}

export type Contracts = Record<string, ContractDescription>

export interface MainBridgeConfig {
  type: string
  proxyAddress: string
  implementation: string
  parameters?: Parameter[]
}

export interface Config {
  mainBridge: MainBridgeConfig
  libAddressManager: string
  startingPoints: string[]
  contracts: Contracts
}
