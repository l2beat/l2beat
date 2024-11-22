import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('educhain', 'arbitrum')

export const educhain: Layer3 = orbitStackL3({
  createdAt: new UnixTime(1720082709), // 2024-07-04T08:45:09Z
  discovery,
  badges: [Badge.DA.DAC, Badge.RaaS.Gelato],
  additionalPurposes: ['Social'],
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'EDU Chain',
    slug: 'edu-chain',
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    description:
      'EDU Chain is Layer 3 on Arbitrum, built on the Orbit stack. It is designed to onboard real-world educational economies to the blockchain and establish an innovative “Learn Own Earn” model for education.',
    links: {
      websites: ['https://opencampus.xyz/'],
      apps: ['https://bridge.gelato.network/bridge/edu-chain'],
      documentation: ['https://userdocs.opencampus.xyz/edu-chain/introduction'],
      explorers: ['https://educhain.blockscout.com/'],
      repositories: ['https://github.com/opencampus-xyz'],
      socialMedia: ['https://x.com/opencampus_xyz'],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://rpc.edu-chain.raas.gelato.cloud',
  discoveryDrivenData: true,
  associatedTokens: ['EDU'],
  nativeToken: 'EDU',
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0x419e439e5c0B839d6e31d7C438939EEE1A4f4184'),
      name: 'StandardGateway',
      description:
        'Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination.',
      tokens: '*',
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0xDd7A9dEcBB0b16B37fE6777e245b18fC0aC63759'),
      name: 'CustomGateway',
      description:
        'Escrows deposited assets for the canonical bridge that are externally governed or need custom token contracts with e.g. minting rights or upgradeability.',
      source: 'external',
      bridgedUsing: {
        bridges: [
          {
            name: 'Canonically (custom escrow)',
          },
        ],
      },
      tokens: '*',
    }),
  ],
  bridge: discovery.getContract('ERC20Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  milestones: [
    {
      name: 'Mainnet launch',
      link: 'https://medium.com/edu-chain', //TODO
      date: '2024-12-02T00:00:00Z',
      description: 'Educhain L3 opens its mainnet to all users.',
      type: 'general',
    },
  ],
})
