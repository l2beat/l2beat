import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { HARDCODED } from '../discovery/values/hardcoded'
import {
  CONTRACTS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  RISK_VIEW,
} from './common'
import { Layer2 } from './types'
import { zkswap } from './zkswap'

const discovery = new ProjectDiscovery('zkspace')

const forcedWithdrawalDelay = HARDCODED.ZKSPACE.PRIORITY_EXPIRATION_PERIOD

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
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_VIA_L1(forcedWithdrawalDelay),
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_ZK,
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
      discovery.getContractDetails(
        'ZkSync',
        'The main Rollup contract. Operator commits blocks, provides zkProof which is validated by the Verifier contract and process withdrawals (executes blocks). Users deposit ETH and ERC20 tokens. This contract defines the upgrade delay in the UPGRADE_NOTICE_PERIOD constant that is currently set to 8 days.',
      ),
      discovery.getContractDetails(
        'ZkSyncCommitBlock',
        'Additional contract to store implementation details of the main ZkSync contract.',
      ),
      discovery.getContractDetails(
        'ZkSyncExit',
        'Additional contract to store implementation details of the main ZkSync contract.',
      ),
      discovery.getContractDetails(
        'ZKSea',
        'Additional contract to store implementation details of the main ZkSync contract.',
      ),
      discovery.getContractDetails(
        'Governance',
        'Keeps a list of block producers and whitelisted tokens.',
      ),
      discovery.getContractDetails(
        'UniswapV2Factory',
        'Manages trading pairs.',
      ),
      discovery.getContractDetails(
        'ZKSeaNFT',
        'Contract managing deposits and withdrawals of NFTs to Layer2.',
      ),
      discovery.getContractDetails('Verifier', 'zk-SNARK Plonk Verifier.'),
      discovery.getContractDetails(
        'VerifierExit',
        'zk-SNARK Verifier for the escape hatch.',
      ),
      discovery.getContractDetails(
        'UpgradeGatekeeper',
        'This is the contract that implements the upgrade mechanism for Governance, Verifier and ZkSync. It relies on the ZkSync contract to enforce upgrade delays.',
      ),
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK('8 days')],
  },
  permissions: [
    {
      name: 'zkSpace Admin',
      accounts: [
        discovery.getPermissionedAccount('UpgradeGatekeeper', 'getMaster'),
      ],
      description:
        'This address is the master of Upgrade Gatekeeper contract, which is allowed to perform upgrades for Governance, Verifier, VerifierExit, PairManager, ZkSeaNFT and ZkSync contracts.',
    },
    {
      name: 'Active validator',
      accounts: discovery.getPermissionedAccounts('Governance', 'validators'),
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
