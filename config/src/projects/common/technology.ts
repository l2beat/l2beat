import { ProjectTechnologyChoice } from '../types'

const PROPOSE_OWN_BLOCKS: ProjectTechnologyChoice = {
  name: 'Users can force submit any transaction',
  description:
    'Because the block production is open to anyone if users experience censorship from the operator they can propose their own blocks which would include their transactions.',
  risks: [],
  references: [],
}

export const TECHNOLOGY = {
  PROPOSE_OWN_BLOCKS,
}
