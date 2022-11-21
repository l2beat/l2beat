import { ProjectId, UnixTime } from '@l2beat/types'

import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS
} from './common'
import { Layer2 } from './types'

export const godwoken: Layer2 = {
  type: 'layer2',
  id: ProjectId('godwoken'),
  display: {
    name: 'Godwoken',
    slug: 'godwoken',
    warning:
      'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots. Developers or users can run a Godwoken readonly node to verify deposits, withdrawals and layer2 transactions.',
    description:
      'Godwoken is an EVM-compatible, L2 optimistic rollup solution built on Nervos CKB L1 (https://github.com/godwokenrises/godwoken)',
    purpose: 'Universal',
    links: {
      websites: ['http://godwoken.com/'],
      apps: [],
      documentation: ['https://docs.godwoken.io'],
      explorers: ['https://gw-mainnet-explorer.nervosdao.community', 'https://v1.gwscan.com'],
      repositories: ['https://github.com/godwokenrises/godwoken'],
      socialMedia: [
        'https://twitter.com/GodwokenRises',
        'https://discord.gg/u62hPYUpub',
        'https://www.reddit.com/r/NervosNetwork/',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  config: {
    associatedTokens: ['pCKB'],
    escrows: [
      {
        address: '0x7538C85caE4E4673253fFd2568c1F1b48A71558a',
        sinceTimestamp: new UnixTime(1656041378),
        tokens: '*',
      },
    ],
    events: [],
    transactionApi: {
      type: 'rpc',
      startBlock: 1, // block 0 has timestamp of beginning of unix time
    },
    transactionApiV2: {
      type: 'rpc',
      startBlock: 1, // block 0 has timestamp of beginning of unix time
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_FP,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    upgradeability: RISK_VIEW.UPGRADABLE_YES,
    sequencerFailure: RISK_VIEW.SEQUENCER_TRANSACT_L1,
    validatorFailure: RISK_VIEW.VALIDATOR_WHITELISTED_BLOCKS,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATOR_PROPOSE_BLOCKS,
  }),
  technology: {
    provider: 'Godwoken',
    category: 'Optimistic Rollup',
    stateCorrectness: STATE_CORRECTNESS.FRAUD_PROOFS,
    dataAvailability: DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
    operator: OPERATOR.CENTRALIZED_SEQUENCER,
    forceTransactions: FORCE_TRANSACTIONS.CANONICAL_ORDERING,
    exitMechanisms: EXITS.RISK_CENTRALIZED_VALIDATOR,
  },
  contracts: {
    addresses: [
      {
        name: 'ERC20',
        address: '0x7538C85caE4E4673253fFd2568c1F1b48A71558a',
        description:
          'pCKB upgradable contract through the protocol L2 codebase.',
      },
    ],
    risks: [
      CONTRACTS.UPGRADE_NO_DELAY_RISK,
      CONTRACTS.UNVERIFIED_RISK,
    ],
  },
  news: [
    {
      date: '2022-05-30',
      name: 'Godwoken v1.1 is live',
      link: 'https://chinanervos.substack.com/p/ckb-weekly-36',
    },
  ],
}
