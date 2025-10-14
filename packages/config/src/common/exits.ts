import { formatSeconds } from '@l2beat/shared-pure'
import type { ProjectRisk, ProjectTechnologyChoice } from '../types'

function REGULAR_WITHDRAWAL(
  type: 'zk' | 'optimistic',
  timeSeconds?: number,
): ProjectTechnologyChoice {
  // optimistic specific considerations
  const delay =
    timeSeconds !== undefined
      ? `takes a challenge period of ${formatSeconds(timeSeconds)}`
      : 'usually takes several days'
  const optimisticConsideration =
    type === 'optimistic'
      ? ` The process of settling a block ${delay} to complete.`
      : ''
  // zk specific considerations
  const zkConsideration =
    type === 'zk' ? ' ZK proofs are required to settle blocks.' : ''
  return {
    name: 'Regular exit',
    description: `The user initiates the withdrawal by submitting a regular transaction on this chain. When the block containing that transaction is settled the funds become available for withdrawal on L1.${optimisticConsideration}${zkConsideration} Finally the user submits an L1 transaction to claim the funds.`,
    risks: [],
    references: [],
  }
}

function REGULAR_MESSAGING(
  type: 'zk' | 'optimistic',
  timeSeconds?: number,
): ProjectTechnologyChoice {
  // optimistic specific considerations
  const delay =
    timeSeconds !== undefined
      ? `takes a challenge period of ${formatSeconds(timeSeconds)}`
      : 'usually takes several days'
  const optimisticConsideration =
    type === 'optimistic'
      ? ` The process of block finalization ${delay} to complete.`
      : ''
  // zk specific considerations
  const zkConsideration =
    type === 'zk' ? ' ZK proofs are required to settle blocks.' : ''
  return {
    name: 'Regular messaging',
    description: `The user initiates L2->L1 messages by submitting a regular transaction on this chain. When the block containing that transaction is settled, the message becomes available for processing on L1.${optimisticConsideration}${zkConsideration}`,
    risks: [],
    references: [],
  }
}

function REGULAR_YIELDING(
  type: 'zk' | 'optimistic',
  timeSeconds?: number,
): ProjectTechnologyChoice {
  const timeString =
    timeSeconds !== undefined
      ? `takes a challenge period of ${formatSeconds(timeSeconds)}`
      : 'usually takes several days'
  const time =
    type === 'optimistic'
      ? ` The process of block finalization ${timeString} to complete.`
      : ''
  return {
    name: 'Regular exit',
    description: `The user initiates the withdrawal by submitting a regular transaction on this chain. When the block containing that transaction is settled the funds become available for withdrawal on L1.${time} Once funds are added to the withdrawal queue, operator must ensure there is enough liquidity for withdrawals. If not, they need to reclaim tokens from Yield Providers.`,
    risks: [],
    references: [],
  }
}

function FORCED_WITHDRAWAL(
  orHalt?: 'forced-withdrawals' | 'all-withdrawals',
): ProjectTechnologyChoice {
  let orHaltString = ''
  if (orHalt) {
    switch (orHalt) {
      case 'forced-withdrawals':
        orHaltString =
          ' or halt all withdrawals from L1, including all forced withdrawals and deposits'
        break
      case 'all-withdrawals':
        orHaltString =
          ' or halt all withdrawals, including forced withdrawals from L1 and regular withdrawals initiated on L2'
        break
    }
  }
  return {
    name: 'Forced exit',
    description: `If the user experiences censorship from the operator with regular exit they can submit their withdrawal requests directly on L1. The system is then obliged to service this request${orHaltString}. Once the force operation is submitted and if the request is serviced, the operation follows the flow of a regular exit.`,
    risks: [],
    references: [],
  }
}

function FORCED_MESSAGING(
  orHalt?: 'forced-messages' | 'all-messages',
): ProjectTechnologyChoice {
  let orHaltString = ''
  if (orHalt) {
    switch (orHalt) {
      case 'forced-messages':
        orHaltString =
          ' or halt all messages from L1, including all forced withdrawals and deposits'
        break
      case 'all-messages':
        orHaltString =
          ' or halt all messages, including forced withdrawals from L1 and regular messages initiated on L2'
        break
    }
  }
  return {
    name: 'Forced messaging',
    description: `If the user experiences censorship from the operator with regular L2->L1 messaging they can submit their messages directly on L1. The system is then obliged to service this request${orHaltString}. Once the force operation is submitted and if the request is serviced, the operation follows the flow of a regular message.`,
    risks: [],
    references: [],
  }
}

function EMERGENCY(
  state: string,
  proof: 'zero knowledge proof' | 'merkle proof',
  delay?: number,
): ProjectTechnologyChoice {
  const risks: ProjectRisk[] =
    proof === 'zero knowledge proof'
      ? [
          {
            category: 'Funds can be lost if',
            text: 'the user is unable to generate the non-trivial ZK proof for exodus withdraw.',
          },
        ]
      : []
  const delayString = delay !== undefined ? formatSeconds(delay) : 'enough time'
  return {
    name: 'Emergency exit',
    description: `If the ${delayString} deadline passes and the forced exit is still ignored the user can put the system into ${state}, disallowing further state updates. In that case everybody can withdraw by submitting a ${proof} of their funds with their L1 transaction.`,
    risks,
    references: [],
  }
}

const STARKEX_REGULAR_PERPETUAL: ProjectTechnologyChoice = {
  ...REGULAR_WITHDRAWAL('zk'),
  references: [
    {
      title: 'Withdrawal - StarkEx documentation',
      url: 'https://docs.starkware.co/starkex/perpetual/withdrawal-perpetual.html',
    },
  ],
}

const STARKEX_REGULAR_SPOT: ProjectTechnologyChoice = {
  ...REGULAR_WITHDRAWAL('zk'),
  description:
    REGULAR_WITHDRAWAL('zk').description +
    ' When withdrawing NFTs they are minted on L1.',
  references: [
    {
      title: 'Withdrawal - StarkEx documentation',
      url: 'https://docs.starkware.co/starkex/spot/withdrawal.html',
    },
  ],
}

const STARKEX_FORCED_PERPETUAL: ProjectTechnologyChoice = {
  ...FORCED_WITHDRAWAL(),
  references: [
    {
      title: 'Forced Operations - StarkEx documentation',
      url: 'https://docs.starkware.co/starkex/perpetual/shared/README-forced-operations.html',
    },
    {
      title: 'Forced Withdrawal - StarkEx documentation',
      url: 'https://docs.starkware.co/starkex/perpetual/perpetual-trading-forced-withdrawal-and-forced-trade.html#forced_withdrawal',
    },
    {
      title: 'Forced Trade - StarkEx documentation',
      url: 'https://docs.starkware.co/starkex/perpetual/perpetual-trading-forced-withdrawal-and-forced-trade.html#forced_trade',
    },
  ],
}

const STARKEX_FORCED_SPOT: ProjectTechnologyChoice = {
  ...FORCED_WITHDRAWAL(),
  references: [
    {
      title: 'Forced Operations - StarkEx documentation',
      url: 'https://docs.starkware.co/starkex/spot/shared/README-forced-operations.html',
    },
    {
      title: 'Full Withdrawal - StarkEx documentation',
      url: 'https://docs.starkware.co/starkex/spot/spot-trading-full-withdrawals.html',
    },
  ],
}

const STARKEX_EMERGENCY_PERPETUAL: ProjectTechnologyChoice = {
  ...EMERGENCY('a frozen state', 'merkle proof'),
  references: [...STARKEX_FORCED_PERPETUAL.references],
}

const STARKEX_EMERGENCY_SPOT: ProjectTechnologyChoice = {
  ...EMERGENCY('a frozen state', 'merkle proof'),
  references: [...STARKEX_FORCED_SPOT.references],
}

const OPERATOR_CENSORS_WITHDRAWAL: ProjectRisk = {
  category: 'Funds can be frozen if',
  text: 'the operator censors withdrawal transaction.',
}

const STARKNET_REGULAR: ProjectTechnologyChoice = {
  ...REGULAR_MESSAGING('zk'),
  description:
    REGULAR_MESSAGING('zk').description +
    ' Note that the message request can be censored by the Sequencer.',
  references: [
    {
      title:
        'Withdrawing is based on l2 to l1 messages - Starknet documentation',
      url: 'https://book.cairo-lang.org/ch16-04-L1-L2-messaging.html#sending-messages-from-starknet-to-ethereum',
    },
  ],
  risks: [OPERATOR_CENSORS_WITHDRAWAL],
}

const STARKNET_EMERGENCY: ProjectTechnologyChoice = {
  name: 'Emergency exit',
  risks: [],
  description:
    'There is no generic escape hatch mechanism as Starknet cannot be forced by users into a frozen state. Note that a freezing mechanism on L2, to be secure, requires anti-censorship protection.',
  references: [],
}

const BLOCKLIST_CENSORS_WITHDRAWAL: ProjectRisk = {
  category: 'Users can be censored if',
  text: 'their address gets added to the Blocklist by the BlockAdmin.',
}

const STARKEX_BLOCKLIST: ProjectTechnologyChoice = {
  name: 'Blocklist',
  description:
    "The BlockAdmin (see Permissions section) can add addresses to a Blocklist, preventing the finalization of their withdrawal on L1. This effectively locks the blocked party's funds in the bridge escrow on L1 if the withdrawal had already been initiated on L2. The Blocklist is also effective on forced withdrawals.",
  risks: [BLOCKLIST_CENSORS_WITHDRAWAL],
  references: [
    {
      title: 'Blocklist - Implementation on etherscan',
      url: 'https://etherscan.io/address/0x5524cB52490e01CBa4EB64F230CC661780cB6298#code#F4#L33',
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

export const AUTONOMOUS: ProjectTechnologyChoice = {
  name: 'Autonomous exit',
  description:
    'Users can (eventually) exit the system by pushing the transaction on L1 and providing the corresponding state root. The only way to prevent such withdrawal is via an upgrade.',
  risks: [],
  references: [],
}

export const RISK_CENTRALIZED_VALIDATOR: ProjectRisk = {
  category: 'Funds can be frozen if',
  text: 'the centralized validator goes down. Users cannot produce blocks themselves and exiting the system requires new block production.',
  isCritical: true,
}

export const RISK_REHYPOTHECATED_ASSETS: ProjectRisk = {
  category: 'Funds can lose value if',
  text: 'there is a hack or the yield goes negative for yield providers.',
  isCritical: true,
}

export const RISK_LACK_OF_LIQUIDITY: ProjectRisk = {
  category: 'Funds can be frozen if',
  text: 'there is not enough liquidity in the bridge, transactions are locked in withdrawal queue.',
  isCritical: true,
}

export const EXITS = {
  REGULAR_WITHDRAWAL,
  REGULAR_MESSAGING,
  REGULAR_YIELDING,
  FORCED_WITHDRAWAL,
  FORCED_MESSAGING,
  EMERGENCY,
  AUTONOMOUS,
  STARKEX_PERPETUAL: [
    STARKEX_REGULAR_PERPETUAL,
    STARKEX_FORCED_PERPETUAL,
    STARKEX_EMERGENCY_PERPETUAL,
  ],
  STARKEX_BLOCKLIST,
  STARKEX_SPOT: [
    STARKEX_REGULAR_SPOT,
    STARKEX_FORCED_SPOT,
    STARKEX_EMERGENCY_SPOT,
  ],
  STARKNET: [STARKNET_REGULAR, STARKNET_EMERGENCY],
  PLASMA,
  RISK_CENTRALIZED_VALIDATOR,
  RISK_REHYPOTHECATED_ASSETS,
  RISK_LACK_OF_LIQUIDITY,
  OPERATOR_CENSORS_WITHDRAWAL,
  BLOCKLIST_CENSORS_WITHDRAWAL,
}
