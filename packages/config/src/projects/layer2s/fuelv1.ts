import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { getStage } from './common/stages/getStage'

const discovery = new ProjectDiscovery('fuelv1')

export const fuelv1: Layer2 = {
  type: 'layer2',
  id: ProjectId('fuelv1'),
  capability: 'appchain',
  addedAt: new UnixTime(1623153328), // 2021-06-08T11:55:28Z
  badges: [Badge.VM.AppChain, Badge.DA.EthereumCalldata],
  display: {
    name: 'Fuel v1',
    slug: 'fuelv1',
    description:
      'Fuel v1 is the first Optimistic Rollup live on Ethereum, supporting payments.',
    purposes: ['Payments'],
    category: 'Optimistic Rollup',

    links: {
      websites: ['https://fuel.sh/'],
      documentation: ['https://docs.fuel.sh/'],
      explorers: ['https://mainnet.fuel.sh/network/'],
      repositories: [
        'https://github.com/FuelLabs/fuel-core',
        'https://github.com/FuelLabs/fuels-rs',
        'https://github.com/FuelLabs/fuels-ts',
        'https://github.com/FuelLabs/fuel-v1-contracts',
      ],
      socialMedia: [
        'https://discord.gg/xfpK4Pe',
        'https://twitter.com/fuellabs_',
        'https://linkedin.com/company/fuel-labs',
        'https://youtube.com/@fuelnetwork',
        'https://hey.xyz/u/fuelnetwork',
      ],
    },
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x6880f6Fd960D1581C2730a451A22EED1081cfD72'),
        sinceTimestamp: new UnixTime(1612414780),
        tokens: ['ETH', 'DAI', 'USDC', 'USDT'],
        chain: 'ethereum',
      },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA,
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_FP_1R,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW_NON_UPGRADABLE,
    sequencerFailure: RISK_VIEW.SEQUENCER_SELF_SEQUENCE(),
    proposerFailure: RISK_VIEW.PROPOSER_SELF_PROPOSE_ROOTS,
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        principle: true,
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: true,
        usersHave7DaysToExit: null,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: null,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: null,
        fraudProofSystemIsPermissionless: true,
        delayWith30DExitWindow: {
          satisfied: true,
          message:
            'Users have at least 30d to exit as the system cannot be upgraded.',
          mode: 'replace',
        },
      },
    },
    {
      rollupNodeLink: 'https://github.com/cartesi/rollups/tree/v1.0.2/offchain',
    },
  ),
  technology: {
    stateCorrectness: {
      ...STATE_CORRECTNESS.FRAUD_PROOFS,
      references: [
        {
          title: 'Background - Fuel documentation',
          url: 'https://docs.fuel.sh/v1.1.0/Concepts/Fundamentals/Fuel%20Overview.html#background',
        },
      ],
    },
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CALLDATA,
      references: [
        {
          title: 'Background - Fuel documentation',
          url: 'https://docs.fuel.sh/v1.1.0/Concepts/Fundamentals/Fuel%20Overview.html#background',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_SEQUENCER,
      references: [
        {
          title: 'Architecture: A High-Level View - Fuel documentation',
          url: 'https://docs.fuel.sh/v1.1.0/Concepts/Fundamentals/Fuel%20Overview.html#architectureahighlevelview',
        },
        {
          title: 'Mainnet deployment parameters - Fuel documentation',
          url: 'https://docs.fuel.sh/v1.1.0/Concepts/Fundamentals/Deployment%20Parameters.html#mainnet',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.PROPOSE_OWN_BLOCKS,
      references: [
        {
          title: 'Architecture: A High-Level View - Fuel documentation',
          url: 'https://docs.fuel.sh/v1.1.0/Concepts/Fundamentals/Fuel%20Overview.html#architectureahighlevelview',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR_WITHDRAWAL('optimistic'),
        references: [
          {
            title: 'Withdraw.yulp#L40 - Fuel documentation',
            url: 'https://github.com/FuelLabs/fuel-v1-contracts/blob/master/src/Withdraw.yulp#L40',
          },
        ],
      },
    ],
  },
  stateDerivation: {
    nodeSoftware:
      'The node software source code can be found [here](https://github.com/FuelLabs/fuel-js).',
    genesisState: `The bridge contracts deployments are the genesis state of the rollup chain. The bridge contracts of mainnet and testnet (rinkeby) deployment block number are available [here](https://github.com/FuelLabs/fuel-js/blob/master/packages/logic/src/genesis.js).`,
    dataFormat:
      'The data format details are documented in the Data Structure subsection [here](https://docs.fuel.sh/v1.1.0/Concepts/Fundamentals/System%20Description%20Primer.html).',
  },
  contracts: {
    addresses: {
      [discovery.chain]: [discovery.getContractDetails('Fuel')],
    },
    risks: [],
  },
  milestones: [
    {
      title: 'Fuel v1 is live on Mainnet',
      url: 'https://twitter.com/fuellabs_/status/1344707195250896899',
      date: '2020-12-31T00:00:00Z',
      description: 'First trustless Optimistic Rollup is live on Mainnet.',
      type: 'general',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'Fuel security stress test by L2BEAT team',
      url: 'https://twitter.com/krzKaczor/status/1524753284434587649',
      thumbnail: NUGGETS.THUMBNAILS.FUEL_01,
    },
  ],
}
