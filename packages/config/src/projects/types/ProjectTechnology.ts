import { ProjectContracts } from './ProjectContracts'
import { ProjectTechnologyChoice } from './ProjectTechnologyChoice'

export interface ProjectTechnology {
  category: {
    /** Name of the category the project belongs to */
    name: ProjectCategory
    /** Additional details about the technology */
    details?: string
  }
  /** What state correctness mechanism is used in the project */
  stateCorrectness: ProjectTechnologyChoice
  /** What is the new cryptography used in the project */
  newCryptography?: ProjectTechnologyChoice
  /** What is the data availability choice for the project */
  dataAvailability: ProjectTechnologyChoice
  /** What are the details about project operator(s) */
  operator: ProjectTechnologyChoice
  /** What are the details about force transactions (censorship resistance) */
  forceTransactions: ProjectTechnologyChoice
  /** A description of the available exit mechanisms */
  exitMechanisms: ProjectTechnologyChoice[]
  /** What is solution to the mass exit problem */
  massExit?: ProjectTechnologyChoice
  /** What is the additional privacy offered */
  additionalPrivacy?: ProjectTechnologyChoice
  /** What are the smart contract capabilities */
  smartContracts?: ProjectTechnologyChoice
  /** List of smart contracts used in the project */
  contracts: ProjectContracts
}

export type ProjectCategory =
  | 'Optimistic Rollup'
  | 'Optimistic Chain'
  | 'Plasma'
  | 'State Pools'
  | 'Validium'
  | 'ZK Rollup'
