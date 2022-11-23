import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/types'

import {
  CONTRACTS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  RISK_VIEW,
} from './common'
import { Layer2 } from './types'
import { zkswap } from './zkswap'

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
        address: '0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8',
        sinceTimestamp: new UnixTime(1639569183),
        tokens: '*',
      },
    ],
    events: [
      {
        name: 'BlockCommit',
        abi: 'event BlockCommit(uint32 indexed blockNumber)',
        emitter: EthereumAddress('0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8'),
        type: 'data',
        sinceTimestamp: new UnixTime(1639569183),
      },
      {
        name: 'MultiblockVerification',
        abi: 'event  MultiblockVerification(uint32 indexed blockNumberFrom, uint32 indexed blockNumberTo)',
        emitter: EthereumAddress('0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8'),
        type: 'state',
        sinceTimestamp: new UnixTime(1639569183),
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
        address: '0x5CDAF83E077DBaC2692b5864CA18b61d67453Be8',
        name: 'ZkSync',
        description:
          'The main Rollup contract. Operator commits blocks, provides zkProof which is validated by the Verifier \
            contract and process withdrawals (executes blocks). Users deposit ETH and ERC20 tokens. This contract defines \
            the upgrade delay in the UPGRADE_NOTICE_PERIOD constant that is currently set to 8 days.',
        upgradeability: {
          type: 'EIP1967',
          admin: '0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390',
          implementation: '0x467a2B91f231D930F5eeB6B982C7666E81DA8626',
        },
      },
      {
        address: '0x49dCe53faeAD4538F77c3b8Bae8347f1644101Db',
        name: 'ZkSyncCommitBlock',
        description:
          'Additional contract to store implementation details of the main ZkSync contract.',
      },
      {
        address: '0x6A4E7dd4c546Ca2DD84b48803040732fC30206D7',
        name: 'ZkSyncExit',
        description:
          'Additional contract to store implementation details of the main ZkSync contract.',
      },
      {
        address: '0x899A605a3B7A11eA5D928958b77014e763c53426',
        name: 'ZkSea',
        description:
          'Additional contract to store implementation details of the main ZkSync contract.',
      },
      {
        address: '0x83Cb1531Ec8447366501aE440478da245EcffB89',
        name: 'Governance',
        description: 'Keeps a list of block producers and whitelisted tokens.',
        upgradeability: {
          type: 'EIP1967',
          admin: '0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390',
          implementation: '0x6659174CdB0c445B897aEd25181f293E468941a5',
        },
      },
      {
        address: '0xc07f850b60E0EEd49a09E455b01a869C25963735',
        name: 'PairManager',
        description: CONTRACTS.UNVERIFIED_DESCRIPTION,
        upgradeability: {
          type: 'EIP1967',
          admin: '0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390',
          implementation: '0x5f3bE7846efC473552C5619b929F7d4aa640fb54',
        },
      },
      {
        address: '0xc632347cc96A4400653E3514eA148630455295b5',
        name: 'ZKSeaNFT',
        description:
          'Contract managing deposits and withdrawals of NFTs to Layer2.',
        upgradeability: {
          type: 'EIP1967',
          admin: '0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390',
          implementation: '0xD06986022EFE62A5BC8258299e4495Bb27567BE0',
        },
      },
      {
        address: '0xB7A4f3eFBe8e2B2FC973FfDb1b1D7F19F012A7af',
        name: 'Verifier',
        description: 'zk-SNARK Plonk Verifier.',
        upgradeability: {
          type: 'EIP1967',
          admin: '0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390',
          implementation: '0x44DedA2C824458A5DfE1e363c679dea33f1ffA39',
        },
      },
      {
        address: '0x1d8d584F1aef51ad5E2f436F057E43e0d788Be81',
        name: 'VerifierExit',
        description: 'zk-SNARK Verifier for the escape hatch.',
        upgradeability: {
          type: 'EIP1967',
          admin: '0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390',
          implementation: '0x41455808B3109AD0f79672C44D75933D3529FEaE',
        },
      },
      {
        address: '0xB0C7E781f70C0B8E3e62F1766a4Be6e435431390',
        name: 'UpgradeGatekeeper',
        description:
          'This is the contract that implements the upgrade mechanism for Governance, Verifier and ZkSync. It relies on the ZkSync contract to enforce upgrade delays.',
      },
    ],
    risks: [
      CONTRACTS.UPGRADE_WITH_DELAY_RISK('8 days'),
      CONTRACTS.UNVERIFIED_RISK,
    ],
  },
  permissions: [
    {
      name: 'zkSpace Admin',
      accounts: [
        {
          type: 'EOA',
          address: '0xfCAE399eA757DDf0a4020198C59BF2270c2B05Be',
        },
      ],
      description:
        'This address is the master of Upgrade Gatekeeper contract, which is allowed to perform upgrades for Governance, Verifier, VerifierExit, PairManager, ZkSeaNFT and ZkSync contracts.',
    },
    {
      name: 'Active validator',
      accounts: [
        {
          address: '0x5bd9404260D2B0D55081E599e4e085BE080141E2',
          type: 'EOA',
        },
      ],
      description:
        'This actor is allowed to propose, revert and execute L2 blocks on L1. A list of active validators is kept inside Governance contract and can be updated by zkSpace Admin.',
    },
  ],
}
