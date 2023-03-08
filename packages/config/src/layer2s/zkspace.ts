import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import {
  CONTRACTS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  RISK_VIEW,
} from './common'
import { ProjectDiscovery } from './common/ProjectDiscovery'
import { Layer2 } from './types'
import { zkswap } from './zkswap'

const discovery = new ProjectDiscovery('zkspace')

export const zkspace: Layer2 = {
  type: 'layer2',
  id: ProjectId('zkspace'),
  display: {
    name: 'ZKSpace',
    slug: 'zkspace',
    description:
      'The ZKSpace platform consists of three main parts: a Layer 2 AMM DEX utilizing ZK-Rollups technology ZKSwap v3, a payment service called ZKSquare, and an NFT marketplace called ZKSea.',
    purpose: 'Tokens, NFTs, AMM',
    links: {
      websites: ['https://zks.org/'],
      apps: ['https://zks.app'],
      documentation: ['https://en.wiki.zks.org/'],
      explorers: ['https://zkspace.info'],
      repositories: ['https://github.com/l2labs/zkswap-contracts'],
      socialMedia: [
        'https://medium.com/@zkspaceofficial',
        'https://twitter.com/ZKSpaceOfficial',
        'https://discord.gg/UbjmQfUVvf',
        'https://t.me/ZKSpaceOfficial',
        'https://reddit.com/r/ZKSwap_Official/',
      ],
    },
  },
  config: {
    associatedTokens: ['ZKS'],
    escrows: [
      {
        address: EthereumAddress('0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8'),
        sinceTimestamp: new UnixTime(1639569183),
        tokens: '*',
      },
    ],
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_SN,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    upgradeability: RISK_VIEW.UPGRADE_DELAY('8 days'),
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_EXIT_L1,
    validatorFailure: RISK_VIEW.VALIDATOR_ESCAPE_ZKP,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    provider: 'zkSync',
    category: zkswap.technology.category,
    stateCorrectness: zkswap.technology.stateCorrectness,
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
      references: [
        {
          text: 'ZKSpace Whitepaper',
          href: 'https://github.com/l2labs/zkspace-whitepaper',
        },
      ],
    },
    dataAvailability: zkswap.technology.dataAvailability,
    operator: zkswap.technology.operator,
    forceTransactions: zkswap.technology.forceTransactions,
    exitMechanisms: zkswap.technology.exitMechanisms,
  },
  contracts: {
    addresses: [
      {
        address: discovery.getContract('ZkSync').address,
        name: 'ZkSync',
        description:
          'The main Rollup contract. Operator commits blocks, provides zkProof which is validated by the Verifier \
            contract and process withdrawals (executes blocks). Users deposit ETH and ERC20 tokens. This contract defines \
            the upgrade delay in the UPGRADE_NOTICE_PERIOD constant that is currently set to 8 days.',
        upgradeability: discovery.getContract('ZkSync').upgradeability,
      },
      {
        address: discovery.getContract('ZkSyncCommitBlock').address,
        name: 'ZkSyncCommitBlock',
        description:
          'Additional contract to store implementation details of the main ZkSync contract.',
      },
      {
        address: discovery.getContract('ZkSyncExit').address,
        name: 'ZkSyncExit',
        description:
          'Additional contract to store implementation details of the main ZkSync contract.',
      },
      {
        address: discovery.getContract('ZKSea').address,
        name: 'ZkSea',
        description:
          'Additional contract to store implementation details of the main ZkSync contract.',
      },
      {
        address: discovery.getContract('Governance').address,
        name: 'Governance',
        description: 'Keeps a list of block producers and whitelisted tokens.',
        upgradeability: discovery.getContract('Governance').upgradeability,
      },
      {
        address: discovery.getContract('UniswapV2Factory').address,
        name: 'PairManager',
        upgradeability:
          discovery.getContract('UniswapV2Factory').upgradeability,
      },
      {
        address: discovery.getContract('ZKSeaNFT').address,
        name: 'ZKSeaNFT',
        description:
          'Contract managing deposits and withdrawals of NFTs to Layer2.',
        upgradeability: discovery.getContract('ZKSeaNFT').upgradeability,
      },
      {
        address: discovery.getContract('Verifier').address,
        name: 'Verifier',
        description: 'zk-SNARK Plonk Verifier.',
        upgradeability: discovery.getContract('Verifier').upgradeability,
      },
      {
        address: discovery.getContract('VerifierExit').address,
        name: 'VerifierExit',
        description: 'zk-SNARK Verifier for the escape hatch.',
        upgradeability: discovery.getContract('VerifierExit').upgradeability,
      },
      {
        address: discovery.getContract('UpgradeGatekeeper').address,
        name: 'UpgradeGatekeeper',
        description:
          'This is the contract that implements the upgrade mechanism for Governance, Verifier and ZkSync. It relies on the ZkSync contract to enforce upgrade delays.',
      },
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK('8 days')],
  },
  permissions: [
    {
      name: 'zkSpace Admin',
      accounts: [
        {
          type: 'EOA',
          address: EthereumAddress(
            discovery.getContractValue<string>(
              'UpgradeGatekeeper',
              'getMaster',
            ),
          ),
        },
      ],
      description:
        'This address is the master of Upgrade Gatekeeper contract, which is allowed to perform upgrades for Governance, Verifier, VerifierExit, PairManager, ZkSeaNFT and ZkSync contracts.',
    },
    {
      name: 'Active validator',
      accounts: discovery
        .getContractValue<string[]>('Governance', 'validators')
        .map((validator) => ({
          address: EthereumAddress(validator),
          type: 'EOA',
        })),
      description:
        'This actor is allowed to propose, revert and execute L2 blocks on L1. A list of active validators is kept inside Governance contract and can be updated by zkSpace Admin.',
    },
  ],
  milestones: [
    {
      name: 'ZKSpace launched',
      link: 'https://medium.com/zkswap/l2-labs-launches-all-in-one-layer2-platform-zkspace-featuring-zkswap-v3-0-nfts-payments-82dae7d9207c',
      date: '2021-12-20T00:00:00Z',
      description:
        'All-in-One Layer2 Platform ZKSpace, Featuring ZKSwap v3.0, NFTs, & Payments is launched.',
    },
    {
      name: 'Token Deposit Campaign started',
      link: 'https://medium.com/@zkspaceofficial/zkspace-releases-token-deposit-campaign-with-fascinating-zks-rewards-151e2492549e',
      date: '2022-02-21T00:00:00Z',
      description: 'Incentives program to onboard new users has started.',
    },
  ],
}
