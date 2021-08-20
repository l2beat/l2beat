import { ProjectTechnologyChoice } from '../types'

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
  FORCE_OPERATIONS,
  OFF_CHAIN_WITHDRAWAL,
  FORCED_WITHDRAWAL,
}
