import { EthereumAddress, ProjectId, formatSeconds } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Bridge } from './types'

const discovery = new ProjectDiscovery('shibarium')

export const shibarium: Bridge = {
  type: 'bridge',
  id: ProjectId('shibarium'),
  display: {
    name: 'Shibarium',
    slug: 'shibarium',
    links: {
      websites: [
        'https://shib.io/',
        'https://shibarium.shib.io'
      ],
      apps: ['https://shibarium.shib.io/bridge'],
      documentation: ['https://docs.shib.io'],
      explorers: ['https://www.shibariumscan.io/'],
      repositories: ['https://github.com/shibaone/static'],
      socialMedia: [
        'https://x.com/Shibtoken',
        'https://x.com/ShibariumNet',
        'https://t.me/ShibariumTechnologies',
        'https://discord.gg/shibariumtech',
      ],
    },
    description:
      'Shibarium\'s PoS (Proof-of-Stake) chain utilizes sidechains to process transactions, resulting in unparalleled transaction speed and cost efficiency. PoS also guarantees asset security by employing the reliable Plasma bridge framework and a decentralized network of PoS validators.',
    category: 'Token Bridge',
  },
  config: {
    associatedTokens: ['BONE'],
    escrows: [
      discovery.getEscrowDetails({
        // DepositManagerProxy for BONE bridge deposits
        address: EthereumAddress('0x885fcE983b6a01633f764325B8c3c5D31032C995'),
        tokens: ['BONE'],
      }),
      discovery.getEscrowDetails({
        // ERC20PredicateProxy for ERC20 tokens bridge deposits
        address: EthereumAddress('0x6Aca26bFCE7675FF71C734BF26C8c0aC4039A4Fa'),
        tokens: ['SHIB', 'LEASH', 'WBTC', 'DAI', 'xFUND', 'USDC', 'USDT', 'KNINE', 'FUND', 'BAD'],
      }),
      discovery.getEscrowDetails({
        // EtherPredicateProxy for ETH bridge deposits
        address: EthereumAddress('0xc3897302aB4B42931cB4857050Fa60f53B775870'),
        tokens: ['ETH'],
      }),
    ],
  },
  riskView: {
    validatedBy: {
      value: 'Destination Chain',
      description:
        'There are multiple validator nodes of the destination chain, all of them need to sign and verify messages',
      sentiment: 'warning',
    },
  },
  
  technology: {
    destination: ['Shibarium'],
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('DepositManagerProxy', {
        description:
          'Bridge BONE deposit manager proxy contract',
      }),
      discovery.getContractDetails('ERC20PredicateProxy', {
        description:
          'ERC20 token deposit proxy contract',
      }),
      discovery.getContractDetails('EtherPredicateProxy', {
        description:
          'ETH deposit proxy contract',
      }),
    ],
    risks: [],
  },
}
