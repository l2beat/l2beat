import type { ProjectTechnologyChoice, ScalingProjectRisk } from '../types'

export const FRONTRUNNING_RISK: ScalingProjectRisk = {
  category: 'MEV can be extracted if',
  text: 'the operator exploits their centralized position and frontruns user transactions.',
}

const CENTRALIZED_OPERATOR: ProjectTechnologyChoice = {
  name: 'The system has a centralized operator',
  description:
    'The operator is the only entity that can propose blocks. A live and trustworthy operator is vital to the health of the system.',
  risks: [FRONTRUNNING_RISK],
  references: [],
}

const CENTRALIZED_SEQUENCER: ProjectTechnologyChoice = {
  name: 'The system has a centralized sequencer',
  description:
    'While forcing transaction is open to anyone the system employs a privileged sequencer that has priority for submitting transaction batches and ordering transactions.',
  risks: [FRONTRUNNING_RISK],
  references: [],
}

const STARKEX_OPERATOR: ProjectTechnologyChoice = {
  ...CENTRALIZED_OPERATOR,
  description:
    CENTRALIZED_OPERATOR.description +
    ' Typically, the Operator is the hot wallet of the StarkEx service submitting state updates for which proofs have been already submitted and verified.',
  references: [
    {
      title: 'Operator - StarkEx documentation',
      url: 'https://docs.starkware.co/starkex/perpetual/shared/contract-management.html#operator_perpetual',
    },
  ],
}

const DECENTRALIZED_OPERATOR: ProjectTechnologyChoice = {
  name: 'There is no central operator',
  description:
    'There is no privileged entity that sequences transactions or produces blocks. This activity is permissionless and open to anyone.',
  risks: [],
  references: [],
}

export const OPERATOR = {
  CENTRALIZED_OPERATOR,
  CENTRALIZED_SEQUENCER,
  STARKEX_OPERATOR,
  DECENTRALIZED_OPERATOR,
}
