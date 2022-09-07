import { Layer2Risk, Layer2TechnologyChoice } from '../types'

function REGULAR(
  type: 'zk' | 'optimistic',
  proof: 'no proof' | 'merkle proof',
): Layer2TechnologyChoice {
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

const FORCED: Layer2TechnologyChoice = {
  name: 'Forced exit',
  description:
    'If the user experiences censorship from the operator with regular exit they can submit their withdrawal requests directly on L1. The system is then obliged to service this request. Once the force operation is submitted if the request is serviced the operation follows the flow of a regular exit.',
  risks: [],
  references: [],
}

function EMERGENCY(
  state: string,
  proof: 'zero knowledge proof' | 'merkle proof',
): Layer2TechnologyChoice {
  const risks: Layer2Risk[] =
    proof === 'zero knowledge proof'
      ? [
          {
            category: 'Funds can be lost if',
            text: 'the user is unable to generate the non-trivial zk proof for exodus withdraw.',
          },
        ]
      : []
  return {
    name: 'Emergency exit',
    description: `If enough time passes and the forced exit is still ignored the user can put the system into ${state}, disallowing further state updates. In that case everybody can withdraw by submitting a ${proof} of their funds with their L1 transaction.`,
    risks,
    references: [],
  }
}

const STARKEX_REGULAR: Layer2TechnologyChoice = {
  ...REGULAR('zk', 'no proof'),
  references: [
    {
      text: 'Withdrawal - StarkEx documentation',
      href: 'https://docs.starkware.co/starkex-v3/starkex-deep-dive/regular-flows/flows-for-off-chain-accounts/withdrawal',
    },
  ],
}

const STARKEX_REGULAR_NFT: Layer2TechnologyChoice = {
  ...REGULAR('zk', 'no proof'),
  description:
    REGULAR('zk', 'no proof').description +
    ' When withdrawing NFTs they are minted on L1.',
  references: [
    {
      text: 'Withdrawal - StarkEx documentation',
      href: 'https://docs.starkware.co/starkex-v3/starkex-deep-dive/regular-flows/flows-for-off-chain-accounts/withdrawal',
    },
  ],
}

const STARKEX_FORCED: Layer2TechnologyChoice = {
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

const STARKEX_EMERGENCY: Layer2TechnologyChoice = {
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

const OPERATOR_CENSORS_WITHDRAWAL: Layer2Risk = {
  category: 'Funds can be frozen if',
  text: 'the operator censors withdrawal transaction.',
}

const STARKNET_REGULAR: Layer2TechnologyChoice = {
  ...REGULAR('zk', 'no proof'),
  description:
    REGULAR('zk', 'no proof').description +
    ' Note that the withdrawal request can be censored by the Sequencer.',
  references: [
    {
      text: ' Withdrawing is based on l2 to l1 messages - StarkNet documentation',
      href: 'https://www.cairo-lang.org/docs/hello_starknet/l1l2.html',
    },
  ],
  risks: [OPERATOR_CENSORS_WITHDRAWAL],
}

const STARKNET_EMERGENCY: Layer2TechnologyChoice = {
  name: 'Emergency exit',
  risks: [],
  description:
    'There is no generic escape hatch mechanism as StarkNet cannot be frozen. Application developers can develp app-specific escape hatches that\
    could allow users to exit funds when L2 app is frozen. Note that freezing mechanizm on L2, to be secure, requires anti-censorship protection.',
  references: [
    {
      text: ' StarkNet code',
      href: 'https://etherscan.io/address/0xd8cd77206fcb239bddaaddda8c87cbfe7d67ca2b#code',
    },
  ],
}

const PLASMA: Layer2TechnologyChoice = {
  name: 'Regular exit',
  description:
    'The user executes the withdrawal by submitting a transaction on L1 that requires a merkle proof of funds.',
  risks: [],
  references: [],
}

export const RISK_CENTRALIZED_VALIDATOR: Layer2Risk = {
  category: 'Funds can be frozen if',
  text: 'the centralized validator goes down. Users cannot produce blocks themselves and exiting the system requires new block production.',
  isCritical: true,
}

export const EXITS = {
  REGULAR,
  FORCED,
  EMERGENCY,
  STARKEX: [STARKEX_REGULAR, STARKEX_FORCED, STARKEX_EMERGENCY],
  STARKEX_NFT: [STARKEX_REGULAR_NFT, STARKEX_FORCED, STARKEX_EMERGENCY],
  STARKNET: [STARKNET_REGULAR, STARKNET_EMERGENCY],
  PLASMA,
  RISK_CENTRALIZED_VALIDATOR,
}
