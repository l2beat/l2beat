import { ProjectTechnologyChoice } from '../types'

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
  ON_CHAIN_DATA,
  PROPOSE_OWN_BLOCKS,
}
