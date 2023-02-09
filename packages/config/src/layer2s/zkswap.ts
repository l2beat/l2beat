import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { ProjectDiscovery } from './common/ProjectDiscovery'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('zkswap1')

export const zkswap: Layer2 = {
  type: 'layer2',
  id: ProjectId('zkswap'),
  display: {
    name: 'ZKSwap 1.0',
    slug: 'zkswap',
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
        'https://medium.com/@zkswapofficial',
        'https://twitter.com/ZKSwapOfficial',
        'https://discord.gg/rpjpeq4Y47',
        'https://t.me/zkswapofficial',
        'https://reddit.com/r/ZKSwap_Official/',
        'https://zks.org/en/blog',
      ],
    },
  },
  config: {
    associatedTokens: ['ZKS'],
    escrows: [
      {
        address: EthereumAddress('0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad'),
        sinceTimestamp: new UnixTime(1613135194),
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
    category: 'ZK Rollup',
    stateCorrectness: {
      ...STATE_CORRECTNESS.VALIDITY_PROOFS,
      references: [
        {
          text: 'ZKSwap Introduces Practical ZK-Rollups - Medium blog',
          href: 'https://medium.com/zkswap/zkswap-introduces-practical-zk-rollups-zkspeed-achieving-high-tps-and-low-gas-fees-in-real-6effe4e789e0',
        },
      ],
    },
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
      references: [
        {
          text: 'ZKSwap Whitepaper - Medium blog',
          href: 'https://medium.com/zkswap/zkswap-whitepaper-a-layer-2-token-swap-protocol-based-on-zk-rollup-113671ef3e6d',
        },
      ],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN,
      references: [
        {
          text: 'ZKSwap Introduces Practical ZK-Rollups - Medium blog',
          href: 'https://medium.com/zkswap/zkswap-introduces-practical-zk-rollups-zkspeed-achieving-high-tps-and-low-gas-fees-in-real-6effe4e789e0',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [
        {
          text: 'ZKSwap Validator - ZKSwap wiki',
          href: 'https://en.wiki.zks.org/techonology#3-validator',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.WITHDRAW_OR_HALT,
      references: [
        {
          text: 'ZkSync.sol#L404 - ZKSwap source code',
          href: 'https://github.com/l2labs/zkswap-contracts-v2/blob/master/contracts/ZkSync.sol#L404',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('zk', 'no proof'),
        references: [
          {
            text: 'Make Transaction',
            href: 'https://en.wiki.zks.org/interact-with-zkswap/make-transaction#withdraw',
          },
        ],
      },
      {
        ...EXITS.FORCED,
        references: [
          {
            text: 'ZkSync.sol#L404 - ZKSwap source code',
            href: 'https://github.com/l2labs/zkswap-contracts-v2/blob/master/contracts/ZkSync.sol#L404',
          },
        ],
      },
      {
        ...EXITS.EMERGENCY('Exodus Mode', 'zero knowledge proof'),
        references: [
          {
            text: 'ZkSyncCommitBlock.sol#L230-L246 - ZKSwap source code',
            href: 'https://github.com/l2labs/zkswap-contracts-v2/blob/3f650d28a266a56d49a3b3d2049cde34112efb14/contracts/ZkSyncCommitBlock.sol#L230-L246',
          },
        ],
      },
    ],
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
        address: EthereumAddress(
          discovery.getContractValue<string>('ZkSync', 'zkSyncExitAddress'),
        ),
        name: 'ZkSyncExit',
      },
      {
        address: discovery.getContract('Governance').address,
        name: 'Governance',
        description: 'Keeps a list of block producers and whitelisted tokens.',
        upgradeability: discovery.getContract('Governance').upgradeability,
      },
      {
        address: EthereumAddress(
          discovery.getContractValue<string>('ZkSync', 'pairManager'),
        ),
        name: 'PairManager',
        upgradeability: discovery.getContract(
          discovery.getContractValue<string>('ZkSync', 'pairManager'),
        ).upgradeability,
      },
      {
        address: EthereumAddress(
          discovery.getContractValue<string>('ZkSync', 'verifier'),
        ),
        name: 'Verifier',
        upgradeability: discovery.getContract(
          discovery.getContractValue<string>('ZkSync', 'verifier'),
        ).upgradeability,
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
      name: 'zkSwap 1.0 Admin',
      accounts: [
        {
          type: 'EOA',
          //Governor.networkGovernor or UpgradeGatekeeper.getMaster??
          address: EthereumAddress(
            '0x7D1a14eeD7af8e26f24bf08BA6eD7A339AbcF037',
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
        'This actor is allowed to propose, revert and execute L2 blocks on L1. A list of active validators is kept inside Governance contract and can be updated by zkSwap 1.0 Admin.',
    },
  ],
}
