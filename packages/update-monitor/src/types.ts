export interface ProjectParameters {
  name: string
  contracts: ContractParameters[]
}

export interface ContractParameters {
  name: string
  address: string
  upgradeability: UpgradeabilityParameters
  values: ContractValue[]
}

export type UpgradeabilityParameters =
  | ImmutableUpgradeability
  | GnosisSafeUpgradeability
  | ProxyUpgradeability

export interface ImmutableUpgradeability {
  type: 'immutable'
}

export interface GnosisSafeUpgradeability {
  type: 'gnosis safe'
}

export interface ProxyUpgradeability {
  type: 'proxy'
  implementation: string
}

export interface ContractValue {
  name: string
  value: string | number | boolean | string[] | number[]
}
