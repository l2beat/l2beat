import { Layer2Reference } from './Layer2Reference'
import { Layer2Risk } from './Layer2Risk'

export interface Layer2Contracts {
  /** List of the contracts */
  addresses: Layer2Contract[]
  /** List of risks associated with the contracts */
  risks: Layer2Risk[]
  /** List of references backing up the claim */
  references?: Layer2Reference[]
}

export interface Layer2Contract {
  /** Address of the contract */
  address: string
  /** Solidity name of the contract */
  name: string
  /** Description of the contract's role in the system */
  description?: string
  /** Details about upgradeability */
  upgradeability?: Layer2Upgradeability
}

export type Layer2Upgradeability =
  | EIP1967Upgradeability
  | StarkWareUpgradeability
  | ZeppelinOsUpgradeability
  | NutBerryUpgradeability
  | ReferenceUpgradeability
  | ArbitrumProxy

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

export interface NutBerryUpgradeability {
  type: 'NutBerry'
  /** Address of the admin */
  admin: string
  /** Address of the implementation */
  implementation: string
}

export interface ReferenceUpgradeability {
  type: 'Reference'
  /** Name of the base contract */
  base: string
  /** Method signature to check */
  method: string
  /** Arguments to the method */
  args?: (string | boolean | number)[]
}

export interface ArbitrumProxy {
  type: 'Arbitrum'
  /** Address of the admin */
  admin: string
  /** Address of the admin logic (regular) implementation */
  adminImplementation: string
  /** Address of the user logic (secondary) implementation */
  userImplementation: string
}
