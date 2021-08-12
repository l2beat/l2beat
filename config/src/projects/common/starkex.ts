import { ProjectTechnologyChoice } from '../types'

const VALIDITY_PROOFS: ProjectTechnologyChoice = {
  name: 'Validity proofs ensure state correctness',
  description:
    'The state stored in the contract is updated when the contract receives a new proof that there exists a valid sequence of transactions that when executed, moves the current state to a new state. State is represented using Merkle roots.',
  risks: [],
  references: [
    {
      text: 'Enforcing Consistency on the On-Chain State - StarkEx documentation',
      href: 'https://docs.starkware.co/starkex-v3/starkex-deep-dive/off-chain-state#enforcing-consistency-on-the-on-chain-state',
    },
  ],
}

const VALIDIUM_DATA_AVAILABILITY: ProjectTechnologyChoice = {
  name: 'Data is not stored on chain',
  description:
    'The balances of the users are not published on-chain, but rather sent to several well known and trusted parties, also known as committee members. A state update is valid and accepted on-chain only if at least a quorum of the committee members sign a state update.',
  risks: [
    {
      category: 'Funds can be lost if',
      text: 'the external data becomes unavailable.',
    },
    {
      category: 'Users can be censored if',
      text: 'the committee restricts their access to the external data.',
    },
  ],
  references: [
    {
      text: 'Validium - StarkEx documentation',
      href: 'https://docs.starkware.co/starkex-v3/starkex-deep-dive/data-availability-modes#validium',
    },
    {
      text: 'Availability Verifiers - StarkEx documentation',
      href: 'https://docs.starkware.co/starkex-v3/starkex-deep-dive/smart-contracts-1/contract-management#availability-verifiers',
    },
  ],
}

const ROLLUP_DATA_AVAILABILITY: ProjectTechnologyChoice = {
  name: 'All data required for proofs is published on chain',
  description:
    "All the relevant data that is used to recover the L2 balances Merkle Tree is published on-chain as calldata. This includes, in addition to the proven new state, the complete list of differences of the users' balances from the previous state.",
  risks: [],
  references: [
    {
      text: 'ZK-Rollup - StarkEx documentation',
      href: 'https://docs.starkware.co/starkex-v3/starkex-deep-dive/data-availability-modes#zk-rollup',
    },
  ],
}

const CRYPTOGRAPHY: ProjectTechnologyChoice = {
  name: 'Zero knowledge STARK cryptography is used',
  description:
    'Despite their production use ZK-STARKs are still new and experimental cryptography. Cryptography has made a lot of advancements in the recent years but all cryptographic solutions rely on time to prove their security.',
  risks: [
    {
      category: 'Funds can be stolen if',
      text: 'the cryptography is broken or implemented incorrectly.',
    },
  ],
  references: [
    {
      text: 'Stark Curve - StarkEx documentation',
      href: 'https://docs.starkware.co/starkex-v3/crypto/stark-curve',
    },
  ],
}

const OPERATOR: ProjectTechnologyChoice = {
  name: 'The operator is a single entity',
  description:
    'The Operator of the contract is the entity entitled to submit state update requests. Typically, the Operator is the hot wallet of the StarkEx service submitting proofs for state updates.',
  risks: [
    {
      category: 'Users can be censored if',
      text: 'the operator refuses to include their activity in proposed state updates.',
    },
  ],
  references: [
    {
      text: 'Operator - StarkEx documentation',
      href: 'https://docs.starkware.co/starkex-v3/starkex-deep-dive/smart-contracts-1/contract-management#operator',
    },
  ],
}

function FORCE_OPERATIONS(type: 'spot' | 'perpetual'): ProjectTechnologyChoice {
  return {
    name: 'Users can avoid censorship by exiting',
    description:
      'StarkEx allows users to force the execution of certain operations by submitting them directly to the StarkEx contract on-chain. The system must serve it within a defined time period. If this does not happen, the user may apply a penalty to the StarkEx contract, e.g., freeze the contract and prevent any new state updates.' +
      (type === 'perpetual'
        ? ' In case of perpetual trading, forcing a trade before exiting is also possible.'
        : ''),
    risks: [],
    references: [
      {
        text: 'Censorship Prevention - StarkEx documentation',
        href: 'https://docs.starkware.co/starkex-v3/architecture/overview#8-censorship-prevention',
      },
    ],
  }
}

const OFF_CHAIN_WITHDRAWAL: ProjectTechnologyChoice = {
  name: 'Regular withdrawal',
  description:
    'The user initiates a withdrawal request on L2. When the block containing the request is proved on L1, the user can withdraw the funds with an L1 transaction.',
  risks: [],
  references: [
    {
      text: 'Withdrawal - StarkEx documentation',
      href: 'https://docs.starkware.co/starkex-v3/starkex-deep-dive/regular-flows/flows-for-off-chain-accounts/withdrawal',
    },
  ],
}

const FORCED_WITHDRAWAL: ProjectTechnologyChoice = {
  name: 'Forced withdrawal',
  description:
    'If the user experiences censorship with regular withdrawals they can submit their withdrawal requests directly on L1. The system is then obliged to service this request. If enough time passes and the request was still unfulfilled the user can freeze the entire system, disallowing further state updates. In that case everybody can withdraw by submitting a Merkle proof of their funds.',
  risks: [],
  references: [
    {
      text: 'Forced Operations - StarkEx documentation',
      href: 'https://docs.starkware.co/starkex-v3/starkex-deep-dive/regular-flows/flows-for-off-chain-accounts/forced-operations',
    },
    {
      text: 'Forced Withdrawal - StarkEx documentation',
      href: 'https://docs.starkware.co/starkex-v3/starkex-deep-dive/smart-contracts-1/in-spot-trading/in-perpetual-trading',
    },
    {
      text: 'Full Withdrawal - StarkEx documentation',
      href: 'https://docs.starkware.co/starkex-v3/starkex-deep-dive/smart-contracts-1/in-spot-trading/in-spot-trading',
    },
  ],
}

export const STARKEX = {
  VALIDITY_PROOFS,
  VALIDIUM_DATA_AVAILABILITY,
  ROLLUP_DATA_AVAILABILITY,
  CRYPTOGRAPHY,
  OPERATOR,
  FORCE_OPERATIONS,
  OFF_CHAIN_WITHDRAWAL,
  FORCED_WITHDRAWAL,
}
