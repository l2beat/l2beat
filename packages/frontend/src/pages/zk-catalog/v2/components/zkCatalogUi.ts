/*
 * Order and copy shared by the React components and the markdown alternate of
 * the ZK catalog sections, so the two renderings cannot drift apart.
 */

export const VERIFIER_STATUS_ORDER = [
  'successful',
  'notVerified',
  'unsuccessful',
] as const

export type VerifierStatus = (typeof VERIFIER_STATUS_ORDER)[number]

export const VERIFIERS_SECTION_INTRO =
  'List of different onchain verifiers for this proving system. Unique ID distinguishes different deployments of the same verifier from different verifiers (e.g. different versions).'

export const VERIFIER_ID_DEFAULT_DESCRIPTION =
  'Verifier ID as recorded by the verifier smart contract.'

export const PROGRAM_HASHES_SECTION_INTRO =
  "List of known guest zkVM programs used by this prover. Each program represents a piece of offchain execution that is verified onchain. The program hash serves as the program's unique identifier."
