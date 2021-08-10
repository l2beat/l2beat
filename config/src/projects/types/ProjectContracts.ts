import { ProjectRisk } from './ProjectRisk'

export interface ProjectContracts {
  /** List of the contracts */
  addresses: ProjectContract[]
  /** List of risks associated with the contracts */
  risks: ProjectRisk[]
}

export interface ProjectContract {
  /** Address of the contract */
  address: string
  /** Solidity name of the contract */
  name: string
  /** Description of the contract's role in the system */
  description?: string
  /** True if there is an upgrade mechanism or the contract can be replaced */
  upgradable: boolean
  /** Delay of the upgrade */
  upgradeDelay?: string
  /** Owner of the contract */
  owner?: {
    /** Address of the owner */
    address: string
    /** Type of the owner */
    type: 'eoa' | 'multisig' | 'governance' | 'other'
  }
}
