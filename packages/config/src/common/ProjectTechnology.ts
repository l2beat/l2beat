import { ProjectTechnologyChoice } from './ProjectTechnologyChoice'

export interface ProjectTechnology {
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
  /** How can the project be upgraded? */
  upgradeMechanism?: ProjectTechnologyChoice
  /** Is the technology section under review */
  isUnderReview?: boolean
}
