import {
  ChainSpecificAddress,
  type EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { BRIDGE_RISK_VIEW } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('hyperliquid')

const challengePeriod = discovery.getContractValue<number>(
  'HyperliquidBridge',
  'disputePeriodSeconds',
)

const validatorSetSize = discovery.getContractValue<number>(
  'HyperliquidBridge',
  'nValidators',
)

const lockerThreshold = discovery.getContractValue<number>(
  'HyperliquidBridge',
  'lockerThreshold',
)

const lockerSetSize = discovery.getContractValue<EthereumAddress[]>(
  'HyperliquidBridge',
  'lockers',
).length

export const hyperliquid: Bridge = {
  type: 'bridge',
  id: ProjectId('hyperliquid'),
  addedAt: UnixTime(1748944294),
  display: {
    name: 'Hyperliquid',
    slug: 'hyperliquid',
    category: 'Single-chain',
    description:
      'Hyperliquid is a performant exchange with its bridge on Arbitrum. It uses a custom consensus algorithm called HyperBFT.',
    links: {
      websites: ['https://hyperfoundation.org/'],
      explorers: ['https://app.hyperliquid.xyz/explorer'],
      bridges: ['https://app.hyperliquid.xyz/trade'],
      socialMedia: ['https://x.com/HyperliquidX'],
      documentation: ['https://hyperliquid.gitbook.io/hyperliquid-docs'],
      repositories: ['https://github.com/hyperliquid-dex'],
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        includeInTotal: false,
        address: ChainSpecificAddress(
          'arb1:0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7',
        ),
        sinceTimestamp: UnixTime(1701389130),
        tokens: ['USDC'],
        description: 'Hyperliquid bridge escrow on Arbitrum.',
      }),
    ],
  },
  riskView: {
    validatedBy: {
      value: `Multisig (3/${validatorSetSize})`,
      description: `3/${validatorSetSize} "hot" validators with onchain signer addresses. Identities of the signers are not publicly disclosed.`,
      sentiment: 'bad',
    },
    governance: {
      upgrade: {
        value: 'Not upgradable',
        description:
          'The smart contract code on Arbitrum that secures the system cannot change.',
        sentiment: 'good',
      },
      pause: {
        value: `Multisig (${lockerThreshold}/${lockerSetSize})`,
        sentiment: 'bad',
        description: `${lockerThreshold}/${lockerSetSize} Lockers can pause the bridge. Only the "cold" validators can unpause it.`,
      },
    },
    livenessFailure: {
      value: 'No mechanism',
      description:
        'If the operators do not service the bridge, deposited funds do not arrive at the destination chain and are stuck.',
      sentiment: 'bad',
    },
    destinationToken: BRIDGE_RISK_VIEW.CANONICAL,
  },
  technology: {
    destination: ['Hyperliquid'],
    canonical: true,
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        'Hyperliquid is a DEX with its main bridge implemented as a smart contract on Arbitrum. Deposits in USDC can be locked in the bridge escrow and are picked up by the permissioned node to be used on the platform. Withdrawals are handled by external actors (validators and finalizers). Although the platform with its main bridge on Arbitrum suggests a decentralized appchain setup, there is no proof system or data availability solution that would qualify it as such.',
      references: [],
      risks: [],
    },
    validation: {
      name: 'Transfers are externally verified',
      description: `Hyperliquid is composed of two sets of permissioned validators, one being a "hot" validator set, and the other being a "cold" one. The hot validator set is responsible for initiating withdrawals upon user requests, while cold validators can invalidate them during the ${challengePeriod}s challenge period and/or rotate both validator sets after an emergency pause. Both sets are currently composed of ${validatorSetSize} validators with equal power. The system accepts a request if signed by 2/3+1 of validators power.`,
      references: [
        {
          title: 'Bridge2 contract: function checkValidatorSignatures()',
          url: 'https://arbiscan.io/address/0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7#code#L2190',
        },
      ],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'the permissioned validator majority sign an invalid withdrawal request.',
        },
        {
          category: 'Funds can be frozen if',
          text: 'the permissioned validator set stops processing withdrawals.',
        },
        {
          category: 'Funds can be frozen if',
          text: 'the permissioned lockers maliciously pause the bridge.',
        },
        {
          category: 'Funds can be stolen if',
          text: "the permissioned finalizers don't finalize withdrawals.",
        },
      ],
    },
  },
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  discoveryInfo: getDiscoveryInfo([discovery]),
}
