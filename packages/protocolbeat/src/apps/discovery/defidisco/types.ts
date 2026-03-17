/** Auto-detected timelock delay from ownership chain analysis */
export interface DetectedTimelockDelay {
  contractAddress: string
  contractName: string
  fieldName: string
  seconds: number
}
