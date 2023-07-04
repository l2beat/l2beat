import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { HARDCODED } from '../discovery/values/hardcoded'
import { formatSeconds } from '../utils/formatSeconds'
import {
  CONTRACTS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  RISK_VIEW,
} from './common'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'
import { zkswap } from './zkswap'

const discovery = new ProjectDiscovery('zkspace')

const upgradeDelay = formatSeconds(HARDCODED.ZKSPACE.UPGRADE_NOTICE_PERIOD)
const forcedWithdrawalDelay = HARDCODED.ZKSPACE.PRIORITY_EXPIRATION_PERIOD

const upgradeability = {
  upgradableBy: ['zkSpace Admin'],
  upgradeDelay,
}

export const zkspace: Layer2 = {
  type: 'layer2',
  id: ProjectId('zkspace'),
  display: {
    name: 'ZKSpace',
    slug: 'zkspace',
    description:
      'The ZKSpace platform consists of three main parts: a Layer 2 AMM DEX utilizing ZK-Rollups technology ZKSwap v3, a payment service called ZKSquare, and an NFT marketplace called ZKSea.',
    purpose: 'Tokens, NFTs, AMM',
    provider: 'zkSync',
    category: zkswap.display.category,
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
      discovery.getEscrowDetails({
        address: EthereumAddress('0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8'),
        sinceTimestamp: new UnixTime(1639569183),
        tokens: '*',
      }),
    ],
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN,
      sources: [
        {
          contract: 'Verifier',
          references: [
            'https://etherscan.io/address/0x44DedA2C824458A5DfE1e363c679dea33f1ffA39#code#F1#L26',
          ],
        },
      ],
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      sources: [
        {
          contract: 'ZkSync',
          references: [
            'https://etherscan.io/address/0x49dCe53faeAD4538F77c3b8Bae8347f1644101Db#code#F1#L79',
          ],
        },
      ],
    },
    upgradeability: {
      ...RISK_VIEW.UPGRADE_DELAY(upgradeDelay),
      sources: [
        {
          contract: 'ZkSync',
          references: [
            'https://etherscan.io/address/0x467a2B91f231D930F5eeB6B982C7666E81DA8626#code#F8#L115',
          ],
        },
      ],
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_FORCE_VIA_L1(forcedWithdrawalDelay),
      sources: [
        {
          contract: 'ZkSync',
          references: [
            'https://etherscan.io/address/0x467a2B91f231D930F5eeB6B982C7666E81DA8626#code#F1#L511',
            'https://etherscan.io/address/0x49dCe53faeAD4538F77c3b8Bae8347f1644101Db#code#F1#L219',
          ],
        },
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_ZK,
      sources: [
        {
          contract: 'ZkSync',
          references: [
            'https://etherscan.io/address/0x49dCe53faeAD4538F77c3b8Bae8347f1644101Db#code#F1#L219',
            'https://etherscan.io/address/0x6A4E7dd4c546Ca2DD84b48803040732fC30206D7#code#F1#L26',
          ],
        },
      ],
    },
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeOpenSource: 'UnderReview',
    },
    stage1: {
      stateVerificationOnL1: true,
      fraudProofSystemAtLeast5Outsiders: null,
      usersHave7DaysToExit: false,
      usersCanExitWithoutCooperation: true,
      securityCouncilProperlySetUp: null,
    },
    stage2: {
      proofSystemOverriddenOnlyInCaseOfABug: null,
      fraudProofSystemIsPermissionless: null,
      delayWith30DExitWindow: false,
    },
  }),
  technology: {
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
      discovery.getContractDetails('ZkSync', {
        description:
          'The main Rollup contract. Operator commits blocks, provides zkProof which is validated by the Verifier contract and process withdrawals (executes blocks). Users deposit ETH and ERC20 tokens. This contract defines the upgrade delay in the UPGRADE_NOTICE_PERIOD constant that is currently set to 8 days.',
        ...upgradeability,
      }),
      discovery.getContractDetails('Governance', {
        description: 'Keeps a list of block producers and whitelisted tokens.',
        ...upgradeability,
      }),
      discovery.getContractDetails('UniswapV2Factory', {
        description: 'Manages trading pairs.',
        ...upgradeability,
      }),
      discovery.getContractDetails('ZkSeaNFT', {
        description:
          'Contract managing deposits and withdrawals of NFTs to Layer2.',
        ...upgradeability,
      }),
      discovery.getContractDetails('Verifier', {
        description: 'zk-SNARK Plonk Verifier.',
        ...upgradeability,
      }),
      discovery.getContractDetails('VerifierExit', {
        description: 'zk-SNARK Verifier for the escape hatch.',
        ...upgradeability,
      }),
      discovery.getContractDetails(
        'UpgradeGatekeeper',
        'This is the contract that implements the upgrade mechanism for Governance, Verifier and ZkSync. It relies on the ZkSync contract to enforce upgrade delays.',
      ),
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK(upgradeDelay)],
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
