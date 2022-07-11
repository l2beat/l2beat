export interface ProjectParameters {
  name: string
  contracts: ContractParameters[]
}

export interface ContractParameters {
  name: string
  address: string
  upgradeability: UpgradeabilityParameters
  roles: RoleParameters[]
  values: ContractValue[]
}

export type UpgradeabilityParameters =
  | ImmutableUpgradeability
  | ProxyUpgradeability

export interface ImmutableUpgradeability {
  type: 'immutable'
}

export interface ProxyUpgradeability {
  type: 'proxy'
  implementation: string
}

export interface RoleParameters {
  name: string
  members: string[]
  permissions: string[]
}

export interface ContractValue {
  name: string
  value: string | number | boolean | string[] | number[]
}
