import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'
import {
  RISK_VIEW,
  addSentimentToDataAvailability,
  makeBridgeCompatible,
} from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('bugbuster', 'optimism')

export const bugbuster: Layer3 = {
  type: 'layer3',
  id: ProjectId('bugbuster'),
  hostChain: ProjectId('optimism'),
  badges: [
    Badge.Stack.Cartesi,
    Badge.VM.AppChain,
    Badge.VM.CartesiVM,
    Badge.DA.EthereumBlobs,
    Badge.L3ParentChain.Optimism,
  ],
  display: {
    name: 'Bug Buster',
    slug: 'bugbuster',
    description:
      'Bug Buster is a trustless, open source bug bounty platform for web3, powered by Cartesi.',
    purposes: ['Bug bounty'],
    category: 'Optimistic Rollup',
    provider: 'Cartesi Rollups',
    links: {
      documentation: [
        'https://github.com/crypto-bug-hunters/bug-buster/blob/main/README.md',
      ],
      repositories: ['https://github.com/crypto-bug-hunters/bug-buster'],
      socialMedia: [
        'https://x.com/BugBusterApp',
        'https://t.me/+G_CPMEhCHC04MzA5',
      ],
      websites: ['https://bugbuster.app/'],
      apps: [],
      explorers: [
        'https://optimism.cartesiscan.io/applications/0x9cb6c6e904ce6bf3ca6d0002b9629acce74ea89b',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x9cb6C6E904cE6BF3Ca6d0002b9629acce74Ea89b'),
        tokens: '*',
        description: 'DApp Contract storing bounties funds.',
      }),
    ],
  },
  technology: {
    stateCorrectness: {
      name: 'Fraud proofs are in development',
      description:
        'Ultimately, Cartesi DApps will use interactive fraud proofs to enforce state correctness. This feature is currently in development and the Honeypot DApp permits invalid state roots. Since Honeypot is immutable, this feature will not be added to the DApp.',
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'an invalid state root is submitted to the system by the configured Authority.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'Authority.sol#L48 - Optimism Etherscan source code, submitClaim function',
          href: 'https://optimistic.etherscan.io/address/0x4246F5b1E52Fef1C52c96a9b1B679AE818d4fb35#code#F1#L48',
        },
      ],
    },
  },
  dataAvailability: addSentimentToDataAvailability({
    layers: ['Ethereum (calldata)'],
    bridge: { type: 'Enshrined' },
    mode: 'Transaction data',
  }),
  riskView: makeBridgeCompatible({
    stateValidation: {
      ...RISK_VIEW.STATE_NONE,
      value: 'None',
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      sources: [
        {
          contract: 'InputBox',
          references: [
            'https://optimistic.etherscan.io/address/0x59b22D57D4f067708AB0c00552767405926dc768#code#F1#L30',
          ],
        },
      ],
    },
    exitWindow: RISK_VIEW.EXIT_WINDOW_NON_UPGRADABLE,
    sequencerFailure: RISK_VIEW.SEQUENCER_SELF_SEQUENCE(0),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
    destinationToken: RISK_VIEW.CANONICAL,
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  contracts: {
    addresses: [
      discovery.getContractDetails('Honeypot', {
        description:
          'CartesiDApp instance for the Honeypot DApp, responsible for holding assets and allowing the DApp to interact with other smart contracts.',
      }),
      discovery.getContractDetails('InputBox', {
        description:
          'Contract that receives arbitrary blobs as inputs to Cartesi DApps.',
      }),
      discovery.getContractDetails('ERC20Portal', {
        description:
          'Contract that allows anyone to perform transfers of ERC-20 tokens to Cartesi DApps.',
      }),
      discovery.getContractDetails('Authority', {
        description:
          'Simple consensus model controlled by a single address, the owner.',
      }),
      discovery.getContractDetails('History', {
        description: 'Contract that stores claims for Cartesi DApps.',
      }),
    ],
    risks: [],
  },
}
