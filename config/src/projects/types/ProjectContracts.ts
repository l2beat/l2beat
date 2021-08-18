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
  /** Details about upgradeability */
  upgradeability?: ProjectUpgradeability
}

export type ProjectUpgradeability =
  | EIP1967Upgradeability
  | StarkWareUpgradeability
  | ZeppelinOsUpgradeability

export interface EIP1967Upgradeability {
  type: 'EIP1967'
  /** Address of the admin */
  admin: string
  /** Address of the implementation */
  implementation: string
}

export interface StarkWareUpgradeability {
  type: 'StarkWare'
  /** Address of the implementation */
  implementation: string
  /** Address of the nested call proxy implementation */
  callImplementation?: string
  /** Call UPGRADE_ACTIVATION_DELAY() instead of getUpgradeActivationDelay() */
  useConstantDelay?: boolean
  /** Upgrade delay in seconds */
  upgradeDelay: number
  /** Are no more updates accepted? */
  isFinal: boolean
}

export interface ZeppelinOsUpgradeability {
  type: 'ZeppelinOs'
  /** Address of the admin */
  admin: string
  /** Address of the implementation */
  implementation: string
}
