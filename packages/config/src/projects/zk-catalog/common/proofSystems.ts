import type { StringWithAutocomplete } from '@l2beat/shared-pure'
import type { SubVerifier } from '../../../types'

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
    mainArithmetization: 'Plonkish',
    mainPCS: 'KZG',
    trustedSetup,
  }
}

function PLONKSNARK(
  trustedSetup: StringWithAutocomplete<'?'>,
): Omit<SubVerifier, 'name'> {
  return {
    proofSystem: 'Plonk SNARK',
    mainArithmetization: 'Plonkish',
    mainPCS: 'KZG',
    trustedSetup,
  }
}

const PROGRAM: Omit<SubVerifier, 'name'> = {
  proofSystem: 'N/A',
  mainArithmetization: 'N/A',
  mainPCS: 'N/A',
  trustedSetup: 'None',
}

const PLONKY3: Omit<SubVerifier, 'name'> = {
  proofSystem: 'Plonky3',
  mainArithmetization: 'Plonk',
  mainPCS: 'FRI',
  trustedSetup: 'None',
}

export const PROOFS = {
  GROTH16,
  HALO2KZG,
  PLONKSNARK,
  PLONKY3,
  PROGRAM,
}
