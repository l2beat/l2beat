import { ProjectTechnologyChoice } from '../types'

function REGULAR(
  type: 'zk' | 'optimistic',
  proof: 'no proof' | 'merkle proof'
): ProjectTechnologyChoice {
  const finalized = type === 'zk' ? 'proven' : 'finalized'
  const requires = proof === 'no proof' ? 'does not require' : 'requires'
  const time =
    type === 'optimistic'
      ? ' The process of block finalization usually takes several days to complete.'
      : ''
  return {
    name: 'Regular exit',
    description: `The user initiates the withdrawal by submitting a transaction on L2. When the block containing that transaction is ${finalized} the funds become available for withdrawal on L1.${time} Finally the user submits an L1 transaction to claim the funds. This transaction ${requires} a merkle proof.`,
    risks: [],
    references: [],
  }
}

const FORCED: ProjectTechnologyChoice = {
  name: 'Forced exit',
  description:
    'If the user experiences censorship with regular exit they can submit their withdrawal requests directly on L1. The system is then obliged to service this request. Once the force operation is submitted if the request is serviced the operation follows the flow of a regular exit.',
  risks: [],
  references: [],
}

function EMERGENCY(
  state: string,
  proof: 'zero knowledge proof' | 'merkle proof'
): ProjectTechnologyChoice {
  return {
    name: 'Emergency exit',
    description: `If enough time passes and the forced exit is still ignored the user can put the system into ${state}, disallowing further state updates. In that case everybody can withdraw by submitting a ${proof} of their funds with their L1 transaction.`,
    risks: [],
    references: [],
  }
}

const STARKEX_REGULAR: ProjectTechnologyChoice = {
  ...REGULAR('zk', 'no proof'),
  references: [
    {
      text: 'Withdrawal - StarkEx documentation',
      href: 'https://docs.starkware.co/starkex-v3/starkex-deep-dive/regular-flows/flows-for-off-chain-accounts/withdrawal',
    },
  ],
}

const STARKEX_FORCED: ProjectTechnologyChoice = {
  ...FORCED,
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

const STARKEX_EMERGENCY: ProjectTechnologyChoice = {
  ...EMERGENCY('a frozen state', 'merkle proof'),
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

const PLASMA: ProjectTechnologyChoice = {
  name: 'Regular exit',
  description:
    'The user executes the withdrawal by submitting a transaction on L1 that requires a merkle proof of funds.',
  risks: [],
  references: [],
}

export const EXITS = {
  REGULAR,
  FORCED,
  EMERGENCY,
  STARKEX: [STARKEX_REGULAR, STARKEX_FORCED, STARKEX_EMERGENCY],
  PLASMA,
}
