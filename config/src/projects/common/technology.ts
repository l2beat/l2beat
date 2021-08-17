import { ProjectTechnologyChoice } from '../types'

const VALIDITY_PROOFS: ProjectTechnologyChoice = {
  name: 'Validity proofs ensure state correctness',
  description:
    'Each update to the system state must be accompanied by a ZK Proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. Once the proof is processed on the Ethereum blockchain the L2 block is instantly finalized.',
  risks: [],
  references: [],
}

const FRAUD_PROOFS: ProjectTechnologyChoice = {
  name: 'Fraud proofs ensure state correctness',
  description:
    'The published state root is assumed to be correct. For a certain time period, usually one week anyone can submit a fraud proof that shows that the state was incorrect.',
  risks: [
    {
      category: 'Funds can be stolen if',
      text: 'there is no one that checks the published state. Fraud proofs assume at least one honest and able validator.',
    },
  ],
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

const PROPOSE_OWN_BLOCKS: ProjectTechnologyChoice = {
  name: 'Users can force submit any transaction',
  description:
    'Because the block production is open to anyone if users experience censorship from the operator they can propose their own blocks which would include their transactions.',
  risks: [],
  references: [],
}

export const TECHNOLOGY = {
  VALIDITY_PROOFS,
  FRAUD_PROOFS,
  ZK_SNARKS,
  ON_CHAIN_DATA,
  PROPOSE_OWN_BLOCKS,
}
