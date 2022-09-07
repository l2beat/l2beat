import { Layer2Risk, Layer2TechnologyChoice } from '../types'

const FRONTRUNNING_RISK: Layer2Risk = {
  category: 'MEV can be extracted if',
  text: 'the operator exploits their centralized position and frontruns user transactions.',
}

const CENTRALIZED_OPERATOR: Layer2TechnologyChoice = {
  name: 'The system has a centralized operator',
  description:
    'The operator is the only entity that can propose blocks. A live and trustworthy operator is vital to the health of the system.',
  risks: [FRONTRUNNING_RISK],
  references: [],
}

const CENTRALIZED_SEQUENCER: Layer2TechnologyChoice = {
  name: 'The system has a centralized sequencer',
  description:
    'While proposing blocks is open to anyone the system employs a privileged sequencer that has priority for submitting transaction batches and ordering transactions.',
  risks: [FRONTRUNNING_RISK],
  references: [],
}

const STARKEX_OPERATOR: Layer2TechnologyChoice = {
  ...CENTRALIZED_OPERATOR,
  description:
    CENTRALIZED_OPERATOR.description +
    ' Typically, the Operator is the hot wallet of the StarkEx service submitting state updates for which proofs have been already submitted and verified.',
  references: [
    {
      text: 'Operator - StarkEx documentation',
      href: 'https://docs.starkware.co/starkex-v3/starkex-deep-dive/smart-contracts-1/contract-management#operator',
    },
  ],
}

const DECENTRALIZED_OPERATOR: Layer2TechnologyChoice = {
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
