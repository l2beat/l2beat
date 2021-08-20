import { ProjectTechnologyChoice } from '../types'

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
  ZK_SNARKS,
  ON_CHAIN_DATA,
  PROPOSE_OWN_BLOCKS,
}
