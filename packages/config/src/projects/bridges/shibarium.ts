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
    detailedDescription:
      '## Ethereum role on Shibarium PoS\n\n' +
      '\n' +
      'Core contracts on the Ethereum mainnet play a crucial role in connecting Shibarium PoS to Ethereum. These contracts handle functionalities, such as:\n' +
      '\n' +
      '- anchor the Shibarium chain\n' +
      '- manage asset transfers\n' +
      '- implement fraud proofs, to improve transparency and security\n' +
      '- manage the exit queue, to guarantee the transfer of assets back to Ethereum.\n' +
      '\n' +
      '## Public checkpoint nodes\n' +
      '\n' +
      'Public checkpoint nodes act as validators in the Shibarium PoS architecture, performing two primary functions:\n' +
      '\n' +
      '1. Transaction Validation: Nodes validate transactions against the current state of the Shibarium chain.\n' +
      '2. Checkpoint Submission: After validating a set number of transactions, nodes create a Merkle root of transaction hashes (checkpoint) and submit it to the core contracts on the Ethereum mainnet.\n' +
      '' +
      'These nodes ensure data integrity and security through the submission of cryptographic proofs to the core contracts on Ethereum.\n' +
      '## Shibarium sidechain\n' +
      '## Speed\n\n' +
      'To keep users engaged and focused, apps, games, metaverses, and other utilities require fast transaction processing. Shibarium satisfies this requirement by completing transactions at an astonishingly fast pace. With the capability to significantly outperform Ethereum transactions per second. Bridging, deposits, and withdrawals are seamless and effective. Shibarium maintains the security features of Ethereum while substantially enhancing the blockchain\'s speed.\n' +
      '## Scalability\n\n' +
      'Scalability is just as critical as speed, and Shibarium has been designed to scale and adjust to the requirements of any organization, product, platform, project, community, or token. It has been designed to be compatible with major ERC standards, ensuring seamless integration. Validators and checkpoints are submitted to Ethereum to guarantee security. A dynamic and enthusiastic community propels adoption and user engagement.\n' +
      '## Flexibility & simplicity\n' +
      '\n' +
      'The transition to Web3 and Web4 will need a straightforward and adaptable UI, UX, and onboarding process to ensure a seamless flow of users from Web2 (www) to this new system. Shibarium\'s network is fully EVM compatible, so your smart contracts can be deployed directly on it. Building DApps on the blockchain is simpler. It\'s easy to transfer tokens between Shibarium and Ethereum.\n' +
      '## Cost\n\n' +
      'In the current world, businesses must utilize Web3 to stay competitive but it\'s hard to do so when fees are cost prohibitive. Shibarium solves this by keeping many transactions below $.01! With Shibarium\'s proof-of-stake system, transaction costs are fractional. The cost per transaction is significantly lower than Ethereum\'s one. Burning EIP 1559 tokens will result in more predictable gas fees and deflationary token economics. Currently, Shibarium POS chain provides the following services: Send, receive, and store your assets on the Shibarium network with the Shibarium Wallet. Shibarium Bridge, for cross-network withdrawals and deposits. Staking with Shibarium Staking: Get rewards for staking.',
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
