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

const discovery = new ProjectDiscovery('zkswap2')

export const zkswap2: Layer2 = {
  type: 'layer2',
  id: ProjectId('zkswap2'),
  display: {
    name: 'ZKSwap 2.0',
    slug: 'zkswap2',
    warning:
      'Version 3 of the protocol called ZkSpace is available and users are encouraged to move their assets there.',
    description:
      'ZKSwap is a fork of ZkSync with added AMM functionality. Based on ZK-Rollup technology, ZKSwap aims to execute the full functionality of Uniswap on Layer 2, while ensuring the core value of decentralized exchange. ZKSwap aims to increase the TPS by multiple orders of magnitude compared to Uniswap, and make transaction processing hardly consume any gas fees.',
    purpose: 'Payments, AMM',

    links: {
      websites: ['https://zks.org/'],
      apps: ['https://zks.app'],
      documentation: ['https://en.wiki.zks.org/'],
      explorers: ['https://zkswap.info'],
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
        address: EthereumAddress('0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3'),
        sinceTimestamp: new UnixTime(1626059966),
        tokens: '*',
      },
    ],
    events: [],
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
        name: 'ZkSync',
        address: discovery.getContract('ZkSync').address,
        description:
          'The main Rollup contract. Operator commits blocks, provides zkProof which is validated by the Verifier \
              contract and process withdrawals (executes blocks). Users deposit ETH and ERC20 tokens. This contract defines \
              the upgrade delay in the UPGRADE_NOTICE_PERIOD constant that is currently set to 8 days.',
        upgradeability: discovery.getContract('ZkSync').upgradeability,
      },
      {
        name: 'ZkSyncCommitBlock',
        address: discovery.getContract('ZkSyncCommitBlock').address,
        description:
          'Additional contract to store implementation details of the main ZkSync contract.',
      },
      {
        name: 'ZkSyncExit',
        address: EthereumAddress(
          discovery.getContractValue<string>('ZkSync', 'zkSyncExitAddress'),
        ),
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
        address: discovery.getContract('Verifier').address,
        name: 'Verifier',
        description: 'zk-SNARK Plonk Verifier.',
        upgradeability: discovery.getContract('Verifier').upgradeability,
      },
      {
        address: EthereumAddress(
          discovery.getContractValue<string>('ZkSync', 'verifierExit'),
        ),
        name: 'VerifierExit',
        upgradeability: discovery.getContract(
          discovery.getContractValue<string>('ZkSync', 'verifierExit'),
        ).upgradeability,
      },
      {
        address: EthereumAddress('0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7'),
        name: 'UpgradeGatekeeper',
      },
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK('8 days')],
  },
  permissions: [
    {
      name: 'zkSwap 2.0 Admin',
      accounts: [
        {
          type: 'EOA',
          address: EthereumAddress(
            '0x9D7397204F32e0Ee919Ea3475630cdf131086255',
          ),
        },
      ],
      description:
        'This address is the master of Upgrade Gatekeeper contract, which is allowed to perform upgrades for Governance, Verifier, VerifierExit, PairManager and ZkSync contracts.',
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
        'This actor is allowed to propose, revert and execute L2 blocks on L1. A list of active validators is kept inside Governance contract and can be updated by zkSwap 2.0 Admin.',
    },
  ],
}
