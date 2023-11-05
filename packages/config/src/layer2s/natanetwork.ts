import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { assert } from 'console'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import {
  CONTRACTS,
  DATA_AVAILABILITY,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('natanetwork')


export const natanetwork: Layer2 = {
  type: 'layer2',
  id: ProjectId('natanetwork'),
  display: {
    name: 'Nata Network',
    slug: 'natanetwork',
    warning: `Only the whitelisted proposers can publish L2 state roots on L1. The code that secures the system can be changed arbitrarily and without notice.`,
    description:
      'Nata Network is a cross-chain privacy protocol.',
    purpose: 'Privacy',
    category: 'ZK Rollup',
    provider: 'Aztec',
    links: {
      websites: ['https://natanetwork.io'],
      apps: ['https://natanetwork.io'],
      documentation: ['https://docs.natanetwork.io'],
      explorers: ['https://explorer.natanetwork.io/'],
      repositories: ['https://github.com/shichiro-nakahara'],
      socialMedia: [
        'https://twitter.com/nata_network_io',
        'https://mirror.xyz/natanetwork.eth',
        'https://linktr.ee/natanetwork',
        'https://matrix.to/#/!EiAngTwTXkkAWgdYIJ:matrix.org',
      ],
    },
    activityDataSource: 'Explorer API',
  },
  config: {
    escrows: [
     // discovery doesn't work with polygon-pos as of Nov. 1st 2023
	discovery.getEscrowDetails({
        address: EthereumAddress('0x03ebC6d159C41419747354bc819dF274Da9948B5'),
        sinceTimestamp: new UnixTime(1614799636),
        tokens: ['WETH-POLYGON-POS', 'DAI-POLYGON-POS'],
      }),
    ],
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN,

      sources: [
        {
          contract: 'RollupProcessorV6',
          references: [
            'https://polygonscan.com/address/0x2ecc74828381ec92df3f9da68175594b032815b8#code',
          ],
        },
      ],
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      sources: [
        {
          contract: 'RollupProcessorV6',
          references: [
            'https://polygonscan.com/address/0x2ecc74828381ec92df3f9da68175594b032815b8#code',
          ],
        },
      ],
    },
    upgradeability: RISK_VIEW.UPGRADABLE_YES,
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE_ZK(),
      sources: [
        {
          contract: 'RollupProcessorV6',
          references: [
            'https://polygonscan.com/address/0x2ecc74828381ec92df3f9da68175594b032815b8#code',
          ],
        },
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
      description: `Only the whitelisted proposers can publish L2 state roots on L1 within from the last posted root, so in the event of failure the withdrawals are frozen.`,
      sources: [
        {
          contract: 'RollupProcessorV6',
          references: [
            'https://polygonscan.com/address/0x2ecc74828381ec92df3f9da68175594b032815b8#code',
          ],
        },
      ],
    },
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
  }),
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeSourceAvailable: 'UnderReview',
    },
    stage1: {
      stateVerificationOnL1: true,
      fraudProofSystemAtLeast5Outsiders: null,
      usersHave7DaysToExit: false,
      usersCanExitWithoutCooperation: false,
      securityCouncilProperlySetUp: null,
    },
    stage2: {
      proofSystemOverriddenOnlyInCaseOfABug: null,
      fraudProofSystemIsPermissionless: null,
      delayWith30DExitWindow: false,
    },
  }),
  technology: {
    stateCorrectness: {
      ...STATE_CORRECTNESS.VALIDITY_PROOFS,
      references: [
        {
          text: 'RollupProcessorV6.sol - Polygonscan source code',
          href: 'https://polygonscan.com/address/0x2ecc74828381ec92df3f9da68175594b032815b8#code',
        },
      ],
    },
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
      references: [
        {
          text: 'Verifier28x32.sol#L150 - Polygonscan source code',
          href: 'https://polygonscan.com/address/0x0B36beCB3C1De85A8f12b4aB201C1dA8C1D405C6#code',
        },
      ],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN,
      references: [
        {
          text: 'RollupProcessorV6.sol - Polygonscan source code',
          href: 'https://polygonscan.com/address/0x2ecc74828381ec92df3f9da68175594b032815b8#code',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      description: `Only specific addresses appointed by the owner are permitted to propose new blocks during regular rollup operation. Periodically a special window is open during which anyone can propose new blocks.`,
      references: [
        {
          text: 'RollupProcessorV6.sol - Polygonscan source code',
          href: 'https://polygonscan.com/address/0x2ecc74828381ec92df3f9da68175594b032815b8#code',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.PROPOSE_OWN_BLOCKS,
      description:
        FORCE_TRANSACTIONS.PROPOSE_OWN_BLOCKS.description +
        `Periodically the rollup opens a special window during which anyone can propose new blocks.`,
      references: [
        {
          text: 'RollupProcessorV6.sol - Polygonscan source code',
          href: 'https://polygonscan.com/address/0x2ecc74828381ec92df3f9da68175594b032815b8#code',
        },
      ],
      risks: [
        {
          category: 'Funds can be frozen if',
          text: 'the centralized operator censors withdrawal transactions.',
          isCritical: true,
        },
      ],
    },
    exitMechanisms: [
      {
        name: 'Regular withdraw',
        description:
          'The user initiates the withdrawal by submitting a transaction on L2. When the block containing that transaction is proven on L1 the assets are automatically withdrawn to the user.',
        risks: [],
        references: [
          {
            text: 'RollupProcessorV6.sol - Polygonscan source code',
	    href: 'https://polygonscan.com/address/0x2ecc74828381ec92df3f9da68175594b032815b8#code',
          },
        ],
      },
    ],
    additionalPrivacy: {
      name: 'Payments are private',
      description:
        'Balances and identities for all tokens on the Nata rollup are encrypted. Each transaction is encoded as a zkSNARK, protecting user data.',
      risks: [],
      references: [
        {
          text: 'Understand Privacy Sets',
          href: 'https://docs.natanetwork.io/how-natanetwork-works/privacy-sets',
        },
      ],
    },
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('RollupProcessorV6', {
        description: `Main Rollup contract responsible for deposits, withdrawals and accepting transaction batches alongside a ZK proof.`,
        pausable: {
          paused: discovery.getContractValue('RollupProcessorV6', 'paused'),
          pausableBy: ['Nata Multisig'],
        },
        upgradeDelay: 'No delay',
        upgradableBy: ['Nata Multisig'],
      }),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  stateDerivation: {
    nodeSoftware: `The entire stack's source code is housed in a single monorepo, which can be found [here](https://github.com/shichiro-nakahara/aztec-connect).`,
    compressionScheme: 'No compression is used.',
    genesisState:
      'The genesis file is available [here](https://github.com/shichiro-nakahara/aztec-connect/blob/master/yarn-project/falafel/src/environment/init/data/mainnet/accounts), and it includes accounts from [natanetwork](http://natanetwork.io) as well.',
    dataFormat:
      'The code to decode onchain data can be found [here](https://github.com/shichiro-nakahara/aztec-connect/blob/master/yarn-project/barretenberg.js/src/rollup_proof/rollup_proof_data.ts#L453)',
  },
  permissions: [
     // discovery doesn't work with polygon-pos as of Nov. 1st 2023
    ...discovery.getMultisigPermission(
      'Nata Multisig',
      'Owner of RollupProcessor contract. Can add or delete rollup providers. Can change the verifier contract.',
    ),
  ],
  milestones: [
    {
      name: 'Mainnet Launch',
      date: '2023-06-05T00:00:00Z',
      link: 'https://mirror.xyz/natanetwork.eth/xCoHU9y3FjnfoE8q3wXL8DFD8l8FFb4TITEP_euDZ44',
      description:
        'Nata Network is live on mainnet, enabling private payments on Polygon.',
    },
    {
      name: 'Cross-Chain Privacy Protocol',
      date: '2023-09-17T00:00:00Z',
      link: 'https://mirror.xyz/natanetwork.eth/9qsIoUpGC09iTdSxOk-sGuTX01F7ie0NdVsmKqbJmpQ',
      description:
        'The NataGateway connects to LayerZero to enable cross-chain deposits and withdrawals.',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'Explaining the Nata Network',
      url: 'https://docs.natanetwork.io/category/how-nata-network-works',
      thumbnail: NUGGETS.THUMBNAILS.NATA_01,
    },
    {
      title: 'Understanding PLONK',
      url: 'https://vitalik.ca/general/2019/09/22/plonk.html',
      thumbnail: NUGGETS.THUMBNAILS.VITALIK_01,
    },
  ],
}

