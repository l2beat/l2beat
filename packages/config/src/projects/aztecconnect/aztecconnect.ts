import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  FORCE_TRANSACTIONS,
  RISK_VIEW,
  STATE_VALIDATION,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('aztecconnect')

export const aztecconnect: ScalingProject = {
  type: 'layer2',
  id: ProjectId('aztecconnect'),
  addedAt: UnixTime(1623153328), // 2021-06-08T11:55:28Z
  archivedAt: UnixTime(1698278400), // 2023-10-26T00:00:00.000Z,
  capability: 'universal',
  display: {
    name: 'Zk.Money v2 (Aztec Connect)',
    slug: 'aztecconnect',
    warning:
      'EOL: Aztec team shut down their offchain rollup infrastructure on March 31st, 2024. Onchain deposits are disabled and ownership of the rollup contract is irrevocably renounced. Assets in the escrow can be manually withdrawn with the [Aztec Connect Ejector](https://github.com/AztecProtocol/aztec-connect-ejector).',
    description:
      'Aztec Connect is an open source layer 2 network that aims to enable affordable, private crypto payments via zero-knowledge proofs.',
    purposes: ['Payments', 'Privacy'],
    links: {
      websites: ['https://aztec.network/'],
      bridges: ['https://zk.money'],
      documentation: ['https://developers.aztec.network/'],
      explorers: ['https://aztec-connect-prod-explorer.aztec.network/'],
      repositories: ['https://github.com/AztecProtocol/aztec-connect'],
      socialMedia: [
        'https://twitter.com/aztecnetwork',
        'https://medium.com/aztec-protocol',
        'https://t.me/aztecprotocol',
        'https://discord.gg/UDtJr9u',
      ],
    },
  },
  proofSystem: {
    type: 'Validity',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455'),
        sinceTimestamp: UnixTime(1654587783),
        tokens: ['ETH', 'DAI', 'wstETH'],
        chain: 'ethereum',
      },
    ],
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455',
          ),
          selector: '0xf81cccbe',
          functionSignature: 'function processRollup(bytes ,bytes _signatures)',
          sinceTimestamp: UnixTime(1654638194),
          untilTimestamp: UnixTime(1712696939),
        },
      },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.STATE_DIFFS,
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_ZKP_SN,
    proposerFailure: RISK_VIEW.PROPOSER_SELF_PROPOSE_ZK,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW_NON_UPGRADABLE,
    sequencerFailure: RISK_VIEW.SEQUENCER_SELF_SEQUENCE_ZK(),
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: null,
      },
      stage1: {
        principle: true,
        usersHave7DaysToExit: true,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: null,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: null,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: {
          satisfied: true,
          message:
            'Users can exit at any time and the rollup contract is immutable.',
          mode: 'replace',
        },
      },
    },
    {
      rollupNodeLink:
        'https://github.com/AztecProtocol/aztec-connect/tree/v2.1',
    },
  ),
  stateValidation: {
    categories: [
      {
        ...STATE_VALIDATION.VALIDITY_PROOFS,
        references: [
          {
            title: 'RollupProcessorV3.sol#L706 - Etherscan source code',
            url: 'https://etherscan.io/address/0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728#code#F1#L706',
          },
        ],
      },
    ],
  },
  technology: {
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CALLDATA,
      description:
        'Since EOL this is only true if the user themself runs the rollup locally and publishes the data.',
      references: [
        {
          title: 'RollupProcessorV3.sol#L686 - Etherscan source code',
          url: 'https://etherscan.io/address/0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728#code#F1#L686',
        },
      ],
    },
    operator: {
      name: 'No operator',
      risks: [],
      description:
        'Only specific addresses appointed by the owner were permitted to propose new blocks during regular rollup operation. Now that the system is EOL, the rollup can only be processed locally by volunteers.',
      references: [
        {
          title: 'RollupProcessorV3.sol#L692 - Etherscan source code',
          url: 'https://etherscan.io/address/0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728#code#F1#L692',
        },
        {
          title:
            'Aztec Connect Ejector - Codespace template for running the Aztec Connect rollup.',
          url: 'https://github.com/AztecProtocol/aztec-connect-ejector',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.PROPOSE_OWN_BLOCKS,
      description: FORCE_TRANSACTIONS.PROPOSE_OWN_BLOCKS.description,
      risks: [],
    },
    exitMechanisms: [
      {
        name: 'EOL: Manual withdrawal using Aztec Connect Ejector',
        description:
          'EOL: Aztec team announced they are going to shut down the rollup infrastructure on March 31st, 2024. Deposits are disabled and ownership of the rollup contract is irrevocably renounced. Assets in the escrow can be manually withdrawn with the [Aztec Connect Ejector](https://github.com/AztecProtocol/aztec-connect-ejector).',
        risks: [],
        references: [
          {
            title:
              'Aztec Connect Ejector - Codespace template for running the Aztec Connect rollup.',
            url: 'https://github.com/AztecProtocol/aztec-connect-ejector',
          },
        ],
      },
      {
        name: 'Regular withdraw (disabled)',
        description:
          'The user initiates the withdrawal by submitting a transaction on L2. When the block containing that transaction is proven on L1 the assets are automatically withdrawn to the user.',
        risks: [],
        references: [
          {
            title: 'RollupProcessorV3.sol#F1#L1174 - Etherscan source code',
            url: 'https://etherscan.io/address/0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728#code#F1#L1174',
          },
          {
            title: 'RollupProcessorV3.sol#F1#L1332 - Etherscan source code',
            url: 'https://etherscan.io/address/0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728#code#F1#L1332',
          },
        ],
      },
    ],
    otherConsiderations: [
      {
        name: 'Payments are private',
        description:
          'Balances and identities for all tokens on the Aztec rollup are encrypted. Each transaction is encoded as a zkSNARK, protecting user data.',
        risks: [],
        references: [
          {
            title: 'Fast Privacy, Now - Aztec Medium Blog',
            url: 'https://medium.com/aztec-protocol/aztec-zkrollup-layer-2-privacy-1978e90ee3b6#3b25',
          },
        ],
      },
    ],
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails('RollupProcessorV3', {
          description:
            'Main Rollup contract (immutable) responsible for withdrawals and accepting transaction batches alongside a ZK proof.',
        }),
        // rollupBeneficiary is encoded in proofData. Can be set arbitrarily for each rollup.
        // https://etherscan.io/address/0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728#code#F1#L704
        discovery.getContractDetails(
          'AztecFeeDistributor',
          'Contract responsible for distributing fees and reimbursing gas to Rollup Providers.',
        ),
        discovery.getContractDetails(
          'DefiBridgeProxy',
          'Bridge Connector to various DeFi Bridges.',
        ),
        discovery.getContractDetails('Verifier28x32', {
          description: 'Standard Plonk zkSNARK Verifier.',
        }),
      ],
    },
    risks: [],
  },
  stateDerivation: {
    nodeSoftware: `The entire stack's source code is housed in a single monorepo, which can be found [here](https://github.com/AztecProtocol/aztec-connect/). For instructions on running the node, please refer to [this readme](https://github.com/AztecProtocol/aztec-connect/blob/v2.1/yarn-project/README.md). Since EOL the [aztec-connect-ejector](https://github.com/AztecProtocol/aztec-connect-ejector) can be used to run a rollup instance and withdraw.`,
    compressionScheme: 'No compression is used.',
    genesisState:
      'The genesis file is available [here](https://github.com/AztecProtocol/aztec-connect/blob/v2.1/yarn-project/falafel/src/environment/init/data/mainnet/accounts), and it includes accounts from [zk.money](http://zk.money) as well.',
    dataFormat:
      'The code to decode onchain data can be found [here](https://github.com/AztecProtocol/aztec-connect/blob/master/yarn-project/barretenberg.js/src/rollup_proof/rollup_proof_data.ts#L453)',
  },
  milestones: [
    {
      title: 'Aztec operator sunset',
      date: '2024-04-30T00:00:00Z',
      url: 'https://medium.com/aztec-protocol/sunsetting-aztec-connect-a786edce5cae',
      description:
        'Aztec stops rollup operators, renouces ownership. Users must run the Rollup manually to withdraw.',
      type: 'general',
    },
    {
      title: 'Mainnet Launch',
      date: '2022-07-07T00:00:00Z',
      url: 'https://medium.com/aztec-protocol/aztec-network-launches-first-ever-private-defi-solution-for-ethereum-e5ec7624d430',
      description:
        'Aztec Connect is live on mainnet, enabling private DeFi on Ethereum.',
      type: 'general',
    },
    {
      title: 'Introducing Noir',
      date: '2022-10-06T00:00:00Z',
      url: 'https://medium.com/aztec-protocol/introducing-noir-the-universal-language-of-zero-knowledge-ff43f38d86d9',
      description:
        'Noir - programming language for zero-knowledge proofs, has been introduced.',
      type: 'general',
    },
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
}
