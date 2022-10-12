import { ProjectId, UnixTime } from '@l2beat/types'

import { CONTRACTS } from '../layer2s/common'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

export const orbit: Bridge = {
  type: 'bridge',
  id: ProjectId('orbit'),
  display: {
    name: 'Orbit Bridge',
    slug: 'orbit',
    links: {
      websites: [
        'https://bridge.orbitchain.io/',
        'https://orbitchain.io/about'
      ],
      apps: ['https://bridge.orbitchain.io/'],
      socialMedia: [
        'https://twitter.com/Orbit_Chain',
        'https://t.me/OrbitChainGlobal',
        'https://discord.com/invite/orbit-chain',
      ],
      documentation: ['https://bridge-docs.orbitchain.io/'],
      repositories: ['https://github.com/orbit-chain'],
      explorers: ['https://bridge.orbitchain.io/history/token/ALL'],
    },
  },
  config: {
    associatedTokens: ['ORC'],
    escrows: [
      {
        address: '0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a',
        sinceTimestamp: new UnixTime(1603950507),
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
      },
    ],
  },
  technology: {
    category: 'Token Bridge',
    //TODO: Originally for KLAYTN, Orbit Bridge now supports multiple chains and has Liquidity Network
    destination: [
      'Orbit',
      'Klaytn',
      'BNB',
      'Avalanche',
      'Celo',
      'Fantom',
      'Gnosis',
      'HECO',
      'ICON',
      'OKC',
      'Polygon',
    ],
    principleOfOperation: {
      name: 'Principal of Operation',
      description:
        'Orbit Bridge is part of the Orbit Chain project. It is a cross-chain bridge that allows users to transfer tokens between different blockchains. Tokens are deposited on the source chain and "representation tokens" are minted on the destination chain. Deposited tokens are not locked and can be used in DeFi protocols by Orbit Farm. Accrued interest is not passed directly to token depositors.',
      references: [],
      risks: [],
    }
  },
  riskView: {
    validatedBy: {
      value: 'Third Party',
      description: 'MultiSig, depending on destination',
      sentiment: 'bad'
    },
    sourceUpgradeability: {
      value: 'Yes',
      description: 'Contracts can be upgraded by 6/9 MultiSig. Bridge source code implementation is not verified on Etherscan.',
      sentiment: 'bad',
    },
    destinationToken: {
      ...RISK_VIEW.WRAPPED,
      description: RISK_VIEW.WRAPPED.description +
      ' Tokens are minted as Orbit Bridge specific oTokens.'
    }
  },
  contracts: {
    addresses: [
      {
        address: '0x1Bf68A9d1EaEe7826b3593C20a0ca93293cb489a',
        name: 'EthVault',
        description: 'Bridge contract, Escrow, Governance.',
        upgradeability: {
          type: 'CustomWithoutAdmin',
          implementation: '0xe62Fa6C59AD14B46d4e7791FA817030732953b79',
        },
      },
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    {
      accounts: [
        { address: '0x8a3F117Ef3b40f1661Dedf7f28fC33E7b6fae4F8', type: 'EOA' },
        { address: '0x67C3c784C49d9ab8757ADb71491df1A1B38FbFA8', type: 'EOA' },
        { address: '0x34EBf4f74a881eB63F666E63ce1Ff2F287CA5a8b', type: 'EOA' },
        { address: '0x3b6590Ff12Ba188e465395E1610D8368613054B0', type: 'EOA' },
        { address: '0x3924Ac70075078A7713f543b72e3F8817ecEc646', type: 'EOA' },
        { address: '0xd1176F2f576C102F6516D386De53ec7a72Cc1491', type: 'EOA' },
        { address: '0x1c0Cd56F1c3E2cF13B9B44dBE5529104bade543E', type: 'EOA' },
        { address: '0x6013f0B3ffE1fFdcA3Fc6A8cd705b1Af048F7437', type: 'EOA' },
        { address: '0xa6dc28CbcB2f8060a00b4FA67F9b67775AC5a3a1', type: 'EOA' },
      ],
      name: 'Bridge contract Governance',
      description: 'Participants of Bridge Governance 6/9 MultiSig'
    },
  ]
}
