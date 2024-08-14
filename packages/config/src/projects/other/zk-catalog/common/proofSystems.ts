import { SubVerifier } from '../../../types'

function GROTH16(phase1setup: string): Omit<SubVerifier, 'name'> {
  return {
    proofSystem: 'Groth16',
    mainArithmetization: 'R1CS+QAP',
    mainPCS: 'N/A',
    trustedSetup: phase1setup + ' + circuit specific',
  }
}

export const PROOFS = {
  GROTH16,
}
