import { StringWithAutocomplete } from '@l2beat/shared-pure'
import { SubVerifier } from '../../../types'

function GROTH16(
  phase1setup: StringWithAutocomplete<'?'>,
): Omit<SubVerifier, 'name'> {
  const trustedSetup =
    phase1setup === '?' ? '?' : `${phase1setup} + circuit specific`
  return {
    proofSystem: 'Groth16',
    mainArithmetization: 'R1CS+QAP',
    mainPCS: 'N/A',
    trustedSetup,
  }
}

function HALO2KZG(
  trustedSetup: StringWithAutocomplete<'?'>,
): Omit<SubVerifier, 'name'> {
  return {
    proofSystem: 'Halo2',
    mainArithmetization: 'Plonkishish',
    mainPCS: 'KZG',
    trustedSetup,
  }
}

export const PROOFS = {
  GROTH16,
  HALO2KZG,
}
