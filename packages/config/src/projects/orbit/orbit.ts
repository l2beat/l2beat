import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BRIDGE_RISK_VIEW, CONTRACTS } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Bridge } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('orbit')

// TODO: Better non-gnosis multisig support
const orbitMultisigThreshold = `${discovery.getContractValue<number>(
  'ETH Vault',
  'required',
)} / ${discovery.getContractValue<string[]>('ETH Vault', 'getOwners').length}`

export const orbit: Bridge = {
  type: 'bridge',
  id: ProjectId('orbit'),
  addedAt: UnixTime(1663234549), // 2022-09-15T09:35:49Z
  display: {
    name: 'Orbit Bridge',
    slug: 'orbit',
    warning:
      'Orbit Bridge has been hacked on 1 Jan 2024 and is potentially not safe to use.',
    category: 'Token Bridge',
    links: {
      websites: [
        'https://bridge.orbitchain.io/',
        'https://orbitchain.io/about',
      ],
      bridges: ['https://bridge.orbitchain.io/'],
      socialMedia: [
        'https://twitter.com/Orbit_Chain',
        'https://t.me/OrbitChainGlobal',
        'https://discord.gg/orbit-chain',
      ],
      documentation: ['https://bridge-docs.orbitchain.io/'],
      repositories: ['https://github.com/orbit-chain'],
      explorers: [
        'https://bridge.orbitchain.io/history/token/ALL',
        'https://explorer.orbitchain.io',
      ],
    },
    description:
      'Orbit Bridge is part of the Orbit Chain project. It is a cross-chain bridge that allows users to transfer tokens between supported blockchains.',
    detailedDescription:
      'Tokens are deposited on the source chain and "representation tokens" are minted on the destination chain. Deposited tokens are not precisely locked and can be used in DeFi protocols by Orbit Farm. Accrued interest is not passed directly to token depositors.',
  },
  config: {
    associatedTokens: ['ORC'],
    escrows: [
      {
        address: EthereumAddress('0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a'),
        sinceTimestamp: UnixTime(1603950507),
        tokens: [
          'ETH',
          'USDT',
          // 'ORC', Coingecko rank > 300
          'DAI',
          'USDC',
          'WBTC',
          // 'HANDY', Coingecko rank > 300
          'MATIC',
        ],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xBe03a2569d10fd10bDbfE84f5f2E22D9cec4aCd0'),
        sinceTimestamp: UnixTime(1603950507),
        tokens: ['cDAI'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x830433dE03ABedE062660CC629e1A2c714272474'),
        sinceTimestamp: UnixTime(1603950507),
        tokens: ['cUSDC'],
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0xd910f6F23889919fAd9C8cE3171dd557cE0308Da'),
        sinceTimestamp: UnixTime(1603950507),
        tokens: ['cWBTC'],
        chain: 'ethereum',
      },
    ],
  },
  technology: {
    //TODO: Originally for KLAYTN, Orbit Bridge now supports multiple chains and has Liquidity Network
    destination: [
      'Orbit',
      'Klaytn',
      'BNB',
      'Avalanche',
      'Celo',
      'Fantom',
      'destination',
      'HECO',
      'ICON',
      'OKC',
      'Polygon',
    ],
    principleOfOperation: {
      name: 'Principle of Operation',
      description: `Orbit Bridge is a cross-chain bridge that allows users to transfer tokens between different blockchains. Tokens are deposited on the source chain and "representation tokens" are minted on the destination chain. When a user deposits tokens to an escrow contract on Ethereum, a message is relayed to a group o validators via Orbit Hub contract on Orbit chain to a minter contract on a destination chain, where "representation tokens" are minted. Deposited tokens are not locked and can be used in DeFi by Orbit Farm. When a user deposits minted tokens on the destination chain, they are burned and a message is relayed to validators through Orbit Hub contract on Orbit chain to the ETH vault bridge contract, which releases the tokens if at least ${orbitMultisigThreshold} validators have signed and liquidity is available. The source code of the farm contracts is not verified on Etherscan.`,
      references: [
        {
          title: 'Bridging transactions',
          url: 'https://bridge-docs.orbitchain.io/bridging-transaction',
        },
      ],
      risks: [],
      isIncomplete: true,
    },
    validation: {
      name: 'Validation',
      description:
        'Orbit Bridge actors include Operators and Validators. Operators relay data between Orbit Chain and supported chains, while Validators build multi-sig based consensus on validity of transactions.',
      references: [
        {
          title: 'Orbit Bridge - How it works',
          url: 'https://bridge-docs.orbitchain.io/how-it-works',
        },
      ],
      risks: [
        {
          category: 'Users can be censored if',
          text: 'validators decide to not pass selected messages between chains.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators relay a fake message to a destination chain to mint more tokens than there are locked on Ethereum thus preventing some existing holders from being able to bring their funds back to Ethereum.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'validators relay a fake message to Ethereum chain allowing a user to withdraw tokens from Ethereum escrow when equivalent amount of tokens has not been deposited and burned on destination chain.',
        },
        {
          category: 'Funds can be stolen if',
          text: "there's an exploit in contracts that invest user deposit.",
        },
        {
          category: 'Funds can be frozen if',
          text: "validators don't relay messages between chains.",
        },
        {
          category: 'Funds can be frozen if',
          text: "there's insufficient liquidity of requested token in escrow.",
        },
      ],
      isIncomplete: true,
    },
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description: 'MultiSig, quorum depends on destination',
      sentiment: 'bad',
    },
    destinationToken: {
      ...BRIDGE_RISK_VIEW.WRAPPED,
      description:
        BRIDGE_RISK_VIEW.WRAPPED.description +
        ' Tokens are minted as Orbit Bridge specific oTokens.',
    },
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails(
          'ETH Vault',
          'Bridge contract, Proxy, Escrow, Governance.',
        ),
        discovery.getContractDetails('USDT Farm', 'USDT Compound Farm.'),
        discovery.getContractDetails('DAI Farm', 'DAI Compound Farm.'),
        discovery.getContractDetails('USDC Farm', 'USDC Compound Farm.'),
        discovery.getContractDetails('WBTC Farm', 'WBTC Compound Farm.'),
      ],
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getPermissionDetails(
          'Bridge contract Governance',
          discovery.getPermissionedAccounts('ETH Vault', 'getOwners'),
          `Participants of the Bridge Governance: ${orbitMultisigThreshold} Orbit Multisig. They have admin access to the proxies' functions and can upgrade the bridge implementation without delay.`,
        ),
        discovery.getPermissionDetails(
          'Policy Admin',
          discovery.getPermissionedAccounts('ETH Vault', 'policyAdmin'),
          'Can set bridging fees, gas limits and can pause / unpause the bridge or censor individual withdrawals.',
        ),
      ],
    },
  },
  milestones: [
    {
      title: 'Orbit Bridge hacked for $81.5M',
      date: '2024-01-01T00:00:00.00Z',
      url: 'https://digifinex.medium.com/orbit-bridge-hacked-for-81-5-million-orbit-chain-ecosystem-plummets-1fe5b8d85ff3',
      type: 'incident',
    },
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
}
