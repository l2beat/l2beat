import { ProjectTechnologyChoice } from '../types'

const VALIDITY_PROOFS: ProjectTechnologyChoice = {
  name: 'Validity proofs ensure state correctness',
  description:
    'Each update to the system state must be accompanied by a ZK Proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. Once the proof is processed on the Ethereum blockchain the L2 block is instantly finalized.',
  risks: [],
  references: [],
}

const ZK_SNARKS: ProjectTechnologyChoice = {
  name: 'Zero knowledge SNARK cryptography is used',
  description:
    'Despite their production use ZK-SNARKs are still new and experimental cryptography. Cryptography has made a lot of advancements in the recent years but all cryptographic solutions rely on time to prove their security. In addition ZK-SNARKs require a trusted setup to operate.',
  risks: [
    {
      category: 'Funds can be stolen if',
      text: 'the cryptography is broken or implemented incorrectly.',
    },
  ],
  references: [],
}

const ON_CHAIN_DATA: ProjectTechnologyChoice = {
  name: 'All data required for proofs is published on chain',
  description:
    'All the data that is used to construct the system state is published on chain in the form of cheap calldata. This ensures that it will always be available when needed.',
  risks: [],
  references: [],
}

export const TECHNOLOGY = {
  VALIDITY_PROOFS,
  ZK_SNARKS,
  ON_CHAIN_DATA,
}
