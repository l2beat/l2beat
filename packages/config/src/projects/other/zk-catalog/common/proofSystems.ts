import { SubVerifier } from '../../../types'

function GROTH16(phase1setup: string | '?'): Omit<SubVerifier, 'name'> {
  const trustedSetup =
    phase1setup === '?' ? '?' : `${phase1setup} + circuit specific`
  return {
    proofSystem: 'Groth16',
    mainArithmetization: 'R1CS+QAP',
    mainPCS: 'N/A',
    trustedSetup,
  }
}

export const PROOFS = {
  GROTH16,
}
