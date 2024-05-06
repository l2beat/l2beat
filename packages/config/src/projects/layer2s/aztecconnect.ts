import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  addSentimentToDataAvailability,
  FORCE_TRANSACTIONS,
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  RISK_VIEW,
  STATE_CORRECTNESS,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('aztecconnect')

export const aztecconnect: Layer2 = {
  isArchived: true,
  type: 'layer2',
  id: ProjectId('aztecconnect'),
  display: {
    name: 'Zk.Money v2 (Aztec Connect)',
    slug: 'aztecconnect',
    warning: `EOL: Aztec team announced they are going to shut down the rollup infrastructure on March 31st, 2024. Deposits are disabled and ownership of the rollup contract is irrevocably renounced. Assets in the escrow can be manually withdrawn with the [Aztec Connect Ejector](https://github.com/AztecProtocol/aztec-connect-ejector).`,
    description:
      'Aztec Connect is an open source layer 2 network that aims to enable affordable, private crypto payments via zero-knowledge proofs.',
    purposes: ['DeFi'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://aztec.network/'],
      apps: ['https://zk.money'],
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
    activityDataSource: 'Explorer API',
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0xFF1F2B4ADb9dF6FC8eAFecDcbF96A2B351680455'),
        sinceTimestamp: new UnixTime(1654587783),
        tokens: ['ETH', 'DAI', 'wstETH'],
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
          sinceTimestampInclusive: new UnixTime(1654638194),
          untilTimestampExclusive: new UnixTime(1712696939),
        },
      },
    ],
  },
  dataAvailability: addSentimentToDataAvailability({
    layers: ['Ethereum (calldata)'],
    bridge: { type: 'Enshrined' },
    mode: 'State diffs',
  }),
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN,
      sources: [
        {
          contract: 'RollupProcessorV2',
          references: [
            'https://etherscan.io/address/0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728#code#F1#L706',
            'https://etherscan.io/address/0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728#code#F1#L1041',
            'https://etherscan.io/address/0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728#code#F1#L1054',
            'https://etherscan.io/address/0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728#code#F1#L1135',
          ],
        },
        {
          contract: 'Verifier28x32',
          references: [
            'https://etherscan.io/address/0xb7baA1420f88b7758E341c93463426A2b7651CFB#code#F3#L150',
          ],
        },
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_SELF_PROPOSE_ZK,
    },
    sourceUpgradeability: {
      description:
        'The ownership of the rollup contract (ProxyAdmin) has been irrevocably renounced, which makes it immutable.',
      sentiment: 'good',
      value: 'Immutable',
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      sources: [
        {
          contract: 'RollupProcessorV2',
          references: [
            'https://etherscan.io/address/0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728#code#F1#L686',
          ],
        },
      ],
    },
    exitWindow: RISK_VIEW.EXIT_WINDOW_NON_UPGRADABLE,
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE_ZK(),
      sources: [
        {
          contract: 'RollupProcessorV2',
          references: [
            'https://etherscan.io/address/0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728#code#F1#L697',
          ],
        },
      ],
    },
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
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
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: null,
        usersHave7DaysToExit: true,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: null,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: null,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: null,
      },
    },
    {
      rollupNodeLink:
        'https://github.com/AztecProtocol/aztec-connect/tree/v2.1',
    },
  ),
  technology: {
    stateCorrectness: {
      ...STATE_CORRECTNESS.VALIDITY_PROOFS,
      references: [
        {
          text: 'RollupProcessorV2.sol#L706 - Etherscan source code',
          href: 'https://etherscan.io/address/0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728#code#F1#L706',
        },
      ],
    },
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
      references: [
        {
          text: 'Verifier28x32.sol#L150 - Etherscan source code',
          href: 'https://etherscan.io/address/0xB656f4219f565b93DF57D531B574E17FE0F25939#code#F3#L150',
        },
      ],
    },
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CALLDATA,
      description:
        'Since EOL this is only true if the user themself runs the rollup locally and publishes the data.',
      references: [
        {
          text: 'RollupProcessorV2.sol#L686 - Etherscan source code',
          href: 'https://etherscan.io/address/0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728#code#F1#L686',
        },
      ],
    },
    operator: {
      name: 'No operator',
      risks: [],
      description: `Only specific addresses appointed by the owner were permitted to propose new blocks during regular rollup operation. Now that the system is EOL, the rollup can only be processed locally by volunteers.`,
      references: [
        {
          text: 'RollupProcessorV2.sol#L692 - Etherscan source code',
          href: 'https://etherscan.io/address/0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728#code#F1#L692',
        },
        {
          text: 'Aztec Connect Ejector - Codespace template for running the Aztec Connect rollup.',
          href: 'https://github.com/AztecProtocol/aztec-connect-ejector',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.PROPOSE_OWN_BLOCKS,
      description: FORCE_TRANSACTIONS.PROPOSE_OWN_BLOCKS.description,
      references: [
        {
          text: 'RollupProcessorV2.sol#L697 - Etherscan source code',
          href: 'https://etherscan.io/address/0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728#code#F1#L697',
        },
        {
          text: 'RollupProcessorV2.sol#L697 - Etherscan source code',
          href: 'https://etherscan.io/address/0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728#code#F1#L1491',
        },
      ],
      risks: [],
    },
    exitMechanisms: [
      {
        name: 'EOL: Manual withdrawal using Aztec Connect Ejector',
        description: `EOL: Aztec team announced they are going to shut down the rollup infrastructure on March 31st, 2024. Deposits are disabled and ownership of the rollup contract is irrevocably renounced. Assets in the escrow can be manually withdrawn with the [Aztec Connect Ejector](https://github.com/AztecProtocol/aztec-connect-ejector).`,
        risks: [],
        references: [
          {
            text: 'Aztec Connect Ejector - Codespace template for running the Aztec Connect rollup.',
            href: 'https://github.com/AztecProtocol/aztec-connect-ejector',
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
            text: 'RollupProcessorV2.sol#L1042 - Etherscan source code',
            href: 'https://etherscan.io/address/0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728#code#F1#L1042',
          },
          {
            text: 'RollupProcessorV2.sol#L1206 - Etherscan source code',
            href: 'https://etherscan.io/address/0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728#code#F1#L1206',
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
            text: 'Fast Privacy, Now - Aztec Medium Blog',
            href: 'https://medium.com/aztec-protocol/aztec-zkrollup-layer-2-privacy-1978e90ee3b6#3b25',
          },
        ],
      },
    ],
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('RollupProcessorV2', {
        description: `Main Rollup contract responsible for deposits, withdrawals and accepting transaction batches alongside a ZK proof.`,
      }),
      // rollupBeneficiary is encoded in proofData. Can be set arbitrarily for each rollup.
      // https://etherscan.io/address/0x7d657Ddcf7e2A5fD118dC8A6dDc3dC308AdC2728#code#F1#L704
      {
        address: EthereumAddress('0x4cf32670a53657596E641DFCC6d40f01e4d64927'),
        description:
          'Contract responsible for distributing fees and reimbursing gas to Rollup Providers.',
        name: 'AztecFeeDistributor',
      },
      discovery.getContractDetails(
        'DefiBridgeProxy',
        'Bridge Connector to various DeFi Bridges.',
      ),
      discovery.getContractDetails('Verifier28x32', {
        description: 'Standard Plonk zkSNARK Verifier.',
      }),
    ],
    risks: [],
  },
  stateDerivation: {
    nodeSoftware: `The entire stack's source code is housed in a single monorepo, which can be found [here](https://github.com/AztecProtocol/aztec-connect/tree/v2.1). For instructions on running the node, please refer to [this readme](https://github.com/AztecProtocol/aztec-connect/blob/v2.1/yarn-project/README.md). Since EOL the [aztec-connect-ejector](https://github.com/AztecProtocol/aztec-connect-ejector) can be used to run a rollup instance and withdraw.`,
    compressionScheme: 'No compression is used.',
    genesisState:
      'The genesis file is available [here](https://github.com/AztecProtocol/aztec-connect/blob/v2.1/yarn-project/falafel/src/environment/init/data/mainnet/accounts), and it includes accounts from [zk.money](http://zk.money) as well.',
    dataFormat:
      'The code to decode onchain data can be found [here](https://github.com/AztecProtocol/aztec-connect/blob/master/yarn-project/barretenberg.js/src/rollup_proof/rollup_proof_data.ts#L453)',
  },
  // permissions: [],
  milestones: [
    {
      name: 'Mainnet Launch',
      date: '2022-07-07T00:00:00Z',
      link: 'https://medium.com/aztec-protocol/aztec-network-launches-first-ever-private-defi-solution-for-ethereum-e5ec7624d430',
      description:
        'Aztec Connect is live on mainnet, enabling private DeFi on Ethereum.',
    },
    {
      name: 'Introducing Noir',
      date: '2022-10-06T00:00:00Z',
      link: 'https://medium.com/aztec-protocol/introducing-noir-the-universal-language-of-zero-knowledge-ff43f38d86d9',
      description:
        'Noir - programming language for zero-knowledge proofs, has been introduced.',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'Explaining the Aztec Network',
      url: 'https://medium.com/aztec-protocol/explaining-the-network-in-aztec-network-166862b3ef7d',
      thumbnail: NUGGETS.THUMBNAILS.AZTEC_01,
    },
    {
      title: 'Economics of Aztec ZK Rollup',
      url: 'https://medium.com/aztec-protocol/privacy-for-pennies-scaling-aztecs-zkrollup-9f2b36615cc6',
      thumbnail: NUGGETS.THUMBNAILS.AZTEC_02,
    },
    {
      title: 'Understanding PLONK',
      url: 'https://vitalik.eth.limo/general/2019/09/22/plonk.html',
      thumbnail: NUGGETS.THUMBNAILS.VITALIK_01,
    },
  ],
}
