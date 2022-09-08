import { Layer2Risk, Layer2TechnologyChoice } from '../types'

const EXIT_CENSORSHIP: Layer2Risk = {
  category: 'Users can be censored if',
  text: 'the operator refuses to include their transactions. They can still exit the system.',
}

const WITHDRAW: Layer2TechnologyChoice = {
  name: 'Users can independently exit the system',
  description:
    'Independent exit allows the users to escape censorship by withdrawing their funds. The system allows users to  withdraw their funds by submitting a transaction directly to the contract on-chain.',
  risks: [EXIT_CENSORSHIP],
  references: [],
}

const WITHDRAW_OR_HALT: Layer2TechnologyChoice = {
  name: 'Users can force exit the system',
  description:
    'Force exit allows the users to escape censorship by withdrawing their funds. The system allows users to force the withdrawal of funds by submitting a request directly to the contract on-chain.  The request must be served within a defined time period. If this does not happen, the system will halt regular operation and permit trustless withdrawal of funds.',
  risks: [EXIT_CENSORSHIP],
  references: [],
}

const STARKEX_SPOT_WITHDRAW: Layer2TechnologyChoice = {
  ...WITHDRAW_OR_HALT,
  references: [
    {
      text: 'Censorship Prevention - StarkEx documentation',
      href: 'https://docs.starkware.co/starkex-v3/architecture/overview#8-censorship-prevention',
    },
  ],
}

const STARKEX_PERPETUAL_WITHDRAW: Layer2TechnologyChoice = {
  ...WITHDRAW_OR_HALT,
  description:
    WITHDRAW_OR_HALT.description +
    ' Perpetual positions can also be force closed before withdrawing, however this requires the user to find the counterparty for the trade themselves.',
  references: [
    {
      text: 'Censorship Prevention - StarkEx documentation',
      href: 'https://docs.starkware.co/starkex-v3/architecture/overview#8-censorship-prevention',
    },
    {
      text: 'Forced Trade - StarkEx documentation',
      href: 'https://docs.starkware.co/starkex-v3/starkex-deep-dive/regular-flows/flows-for-off-chain-accounts/forced-operations/perpetual-trading-forced-withdrawal-and-forced-trade#forced-trade',
    },
  ],
  risks: [
    EXIT_CENSORSHIP,
    {
      category: 'Funds can be lost if',
      text: 'the user is unable to find the counterparty for the force trade.',
    },
  ],
}

const CANONICAL_ORDERING: Layer2TechnologyChoice = {
  name: 'Users can force any transaction',
  description:
    'Because the state of the system is based on transactions submitted on-chain and anyone can submit their transactions there it allows the users to circumvent censorship by interacting with the smart contract directly.',
  risks: [],
  references: [],
}

const PROPOSE_OWN_BLOCKS: Layer2TechnologyChoice = {
  name: 'Users can force any transaction',
  description:
    'Because the block production is open to anyone if users experience censorship from the operator they can propose their own blocks which would include their transactions.',
  risks: [
    {
      category: 'Users can be censored if',
      text: 'the operator refuses to include their transactions and users lack resources to propose blocks themselves.',
    },
  ],
  references: [],
}

const NO_MECHANISM: Layer2TechnologyChoice = {
  name: "Users can't force any transaction",
  description:
    'There is no general mechanism to force the sequencer to include the transaction.',
  risks: [
    {
      category: 'Users can be censored if',
      text: 'the operator refuses to include their transactions.',
    },
  ],
  references: [],
}

export const FORCE_TRANSACTIONS = {
  WITHDRAW,
  WITHDRAW_OR_HALT,
  STARKEX_SPOT_WITHDRAW,
  STARKEX_PERPETUAL_WITHDRAW,
  CANONICAL_ORDERING,
  PROPOSE_OWN_BLOCKS,
  NO_MECHANISM,
}
