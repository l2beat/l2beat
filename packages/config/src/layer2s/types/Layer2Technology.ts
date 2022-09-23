import { Layer2TechnologyChoice } from './Layer2TechnologyChoice'

export interface Layer2Technology {
  /** Technology provider */
  provider?: 'StarkEx' | 'Optimism' | 'zkSync'
  category: {
    /** Name of the category the layer2 belongs to */
    name: Layer2Category
    /** Additional details about the technology */
    details?: string
  }
  /** What state correctness mechanism is used in the layer2 */
  stateCorrectness: Layer2TechnologyChoice
  /** What is the new cryptography used in the layer2 */
  newCryptography?: Layer2TechnologyChoice
  /** What is the data availability choice for the layer2 */
  dataAvailability: Layer2TechnologyChoice
  /** What are the details about layer2 operator(s) */
  operator: Layer2TechnologyChoice
  /** What are the details about force transactions (censorship resistance) */
  forceTransactions: Layer2TechnologyChoice
  /** A description of the available exit mechanisms */
  exitMechanisms: Layer2TechnologyChoice[]
  /** What is solution to the mass exit problem */
  massExit?: Layer2TechnologyChoice
  /** What is the additional privacy offered */
  additionalPrivacy?: Layer2TechnologyChoice
  /** What are the smart contract capabilities */
  smartContracts?: Layer2TechnologyChoice
}

export type Layer2Category =
  | 'Optimistic Rollup'
  | 'Optimistic Chain'
  | 'Plasma'
  | 'State Pools'
  | 'Validium'
  | 'ZK Rollup'
