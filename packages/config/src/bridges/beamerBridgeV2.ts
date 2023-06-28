import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { RISK_VIEW } from './common'
import { Bridge } from './types'

const PROJECT_ID = ProjectId('beamer-bridge-v2')
const discovery = new ProjectDiscovery(PROJECT_ID.toString())

export const beamerbridgev2: Bridge = {
  type: 'bridge',
  id: PROJECT_ID,
  display: {
    name: 'Beamer Bridge V2',
    slug: 'beamerbridgev2',
    links: {
      websites: ['https://beamerbridge.com'],
      apps: ['https://app.beamerbridge.com'],
      repositories: ['https://github.com/beamer-bridge/beamer'],
      socialMedia: [
        'https://twitter.com/BeamerBridge',
        'https://discord.gg/beamerbridge',
        'https://medium.com/@BeamerBridge',
      ],
    },
    description:
      'Beamer Bridge is an optimistic rollup-to-rollup bridge that enables direct ERC-20 asset transfers between any two EVM compatible rollups, without transitioning via Layer1(L1). It uses actors called Agents to fulfill user transfer requests on the destination chain. Users lock their assets on the source chain, and Agents provide the assets on the destination chain. Agents later receive the locked capital on the source chain by proving that they actually provided the assets on the destination chain. There is no liquidity pool, every agent participates in the cross-chain transfer by providing their own capital.',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: discovery.getContractDetails('EthereumRequestManager').address,
        sinceTimestamp: new UnixTime(1678964183),
        tokens: ['USDC', 'WETH', 'DAI', 'USDT'],
      }),
    ],
  },
  riskView: {
    validatedBy: {
      value: 'Layer1',
      description:
        'There is a challenge game that can be triggered by participants if they notice mallicious behavior on the side of an agent. To note here is that user funds are not at risk, only the capital of the agent.',
      sentiment: 'warning',
    },
    sourceUpgradeability: {
      value: 'No',
      description: 'The code that secures the system can never change.',
    },
    destinationToken: RISK_VIEW.CANONICAL,
  },
  technology: {
    category: 'Token Bridge',
    destination: ['Mainnet', 'Optimism', 'Arbitrum'],
    principleOfOperation: {
      name: 'Principle of operation',
      description:
        '1.User initiates transaction to contract on Rollup 1, locking fees and assets\n\n2.Agent sends assets to user on Rollup 2\n\nAt this stage, the user is done and receives their assets on target rollup.\n\nFor agents\n\n3.The agent initiates the claim on Rollup 1\n\n4.If no one challenges the claim, the agent can withdraw the assets on Rollup 1 after 24h.',
      references: [
        {
          text: 'Beamer Bridge V2 Architecture',
          href: 'https://docs.beamerbridge.com/whitepaper.html',
        },
      ],
      risks: [],
      isIncomplete: true,
    },
    validation: {
      name: 'Layer 1',
      description:
        'In the Beamer Protocol the risks are mainly taken by the agents and not by end-users. The agents are providing liquidity on the target chain and when proving that they have done so, they are able to withdraw the locked user funds on the source chain.',
      risks: [],
      references: [
        {
          text: 'Beamer Bridge V2 Architecture',
          href: 'https://docs.beamerbridge.com/whitepaper.html',
        },
      ],
    },
    destinationToken: {
      name: 'Destination tokens',
      description:
        'Only tokens that have been bridged using native chain bridges are supported.',
      references: [],
      risks: [],
    },
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('Resolver', {
        name: 'Resolver',
        description:
          'The resolver contract is deployed on L1 and is used in the challenge game.',
      }),
      discovery.getContractDetails('EthereumL1Messenger', {
        address: EthereumAddress('0x12B8489913E2afBCed131d52c345C380BBB65baf'),
        name: 'EthereumL1Messenger',
      }),
      discovery.getContractDetails('EthereumRequestManager', {
        name: 'RequestManager',
        description:
          'Ethereum: When a user wants to perform a transfer from Ethereum to a rollup they deposit their funds in the request manager. An agent fills the request on the target chain and can later claim the funds locked in the RequestManager.',
      }),
      discovery.getContractDetails('EthereumFillManager', {
        name: 'FillManager',
        description:
          'Ethereum: Agents filling requests from a Rollup to Ethereum use this contract to transfer the funds to the user.',
      }),
      discovery.getContractDetails('EthereumL2Messenger', {
        name: 'EthereumL2Messenger',
      }),
      {
        address: EthereumAddress('0x4C366b0CA6F21BDFBb5c0554d818DD50C0519b34'),
        name: 'OptimismL1Messenger',
      },
      {
        address: EthereumAddress('0x5911621aF8826d1AAA5B8B28d63c1e0096f7c0e3'),
        name: 'ArbitrumL1Messenger',
      },
      {
        address: EthereumAddress('0x124198789EF8d82050E620De2b73332C3c6C2eD4'),
        name: 'RequestManager',
        description:
          'Optimism: When a user wants to perform a transfer from Optimism to another Rollup or Mainnet they deposit their funds in the request manager. An agent fills the request on the target chain and can later claim the funds locked in the RequestManager.',
      },
      {
        address: EthereumAddress('0x889aa3c5b5298d70613373F25Ef66Fede25B4de1'),
        name: 'FillManager',
        description:
          'Optimism: Agents filling requests from a Rollup to Optimism use this contract to transfer the funds to the user.',
      },
      {
        address: EthereumAddress('0xddF87c859c713E1BDfDC95BAF1cabB5FBc83C1F8'),
        name: 'OptimismL2Messenger',
      },
      {
        address: EthereumAddress('0x13bAF73f48FCF6A8aAb8431CA3A38c624cdfd8F3'),
        name: 'RequestManager',
        description:
          'Arbitrum: When a user wants to perform a transfer from Arbitrum to another Rollup or Mainnet they deposit their funds in the RequestManager contract. An agent fills the request on the target chain and can later claim the funds locked in the RequestManager.',
      },
      {
        address: EthereumAddress('0x27f72B9745CDE0fbAFe0A0d1119D75f4082bFc47'),
        name: 'FillManager',
        description:
          'Arbitrum: Agents filling requests from a Rollup to Arbitrum use this contract to transfer the funds to the user.',
      },
      {
        address: EthereumAddress('0x8868eDed0b126f0C9bd3388a3003F13FB91c31Bb'),
        name: 'ArbitrumL2Messenger',
      },
    ],
    risks: [],
  },
  permissions: [
    {
      accounts: [
        {
          address: EthereumAddress(
            '0x42405d66fdA09dbDaC90Ff25fC5a4C2353f43E70',
          ),
          type: 'EOA',
        },
      ],
      name: 'Owner of bridge contracts',
      description:
        'Can invoke admin functions on the contracts such as adding new tokens, whitelisting agents or pausing the contracts.',
    },
  ],
}
