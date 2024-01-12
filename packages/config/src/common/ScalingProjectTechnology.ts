import { ScalingProjectTechnologyChoice } from './ScalingProjectTechnologyChoice'

export interface ScalingProjectTechnology {
  /** What state correctness mechanism is used in the project */
  stateCorrectness: ScalingProjectTechnologyChoice
  /** What is the new cryptography used in the project */
  newCryptography?: ScalingProjectTechnologyChoice
  /** What is the data availability choice for the project */
  dataAvailability: ScalingProjectTechnologyChoice
  /** What are the details about project operator(s) */
  operator: ScalingProjectTechnologyChoice
  /** What are the details about force transactions (censorship resistance) */
  forceTransactions: ScalingProjectTechnologyChoice
  /** A description of the available exit mechanisms */
  exitMechanisms: ScalingProjectTechnologyChoice[]
  /** What is solution to the mass exit problem */
  massExit?: ScalingProjectTechnologyChoice
  /** What is the additional privacy offered */
  additionalPrivacy?: ScalingProjectTechnologyChoice
  /** What are the smart contract capabilities */
  smartContracts?: ScalingProjectTechnologyChoice
  /** How can the project be upgraded? */
  upgradeMechanism?: ScalingProjectTechnologyChoice
  /** Is the technology section under review */
  isUnderReview?: boolean
}
