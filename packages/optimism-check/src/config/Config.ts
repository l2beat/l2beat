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
  dependencies?: string[]
  parameters?: Parameter[]
}

export interface Contracts {
  [name: string]: ContractDescription
}

export interface Config {
  libAddressManager: string
  startingPoints: string[]
  contracts: Contracts
}
