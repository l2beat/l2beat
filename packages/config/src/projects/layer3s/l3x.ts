import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ESCROW } from '../../common/escrow'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL3 } from '../layer2s/templates/orbitStack'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('l3x', 'arbitrum')
const upgradeability = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

export const l3x: Layer3 = orbitStackL3({
  createdAt: new UnixTime(1718370384), // 2024-06-14T13:06:24Z
  hostChain: ProjectId('arbitrum'),
  discovery,
  badges: [Badge.DA.DAC, Badge.L3ParentChain.Arbitrum],
  display: {
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    name: 'L3X',
    slug: 'l3x',
    description:
      'L3X is an Orbit stack Appchain on Arbitrum focusing on DeFi (leveraged trading and liquid restaking).',
    links: {
      websites: ['https://l3x.com/'],
      apps: [
        'https://bridge.arbitrum.io/?destinationChain=l3x-network&sourceChain=arbitrum-one',
      ],
      documentation: ['https://docs.l3x.com/'],
      explorers: ['https://explorer.l3x.com/'],
      repositories: [],
      socialMedia: ['https://t.me/l3x_protocol', 'https://x.com/l3x_protocol'],
    },
  },
  chainConfig: {
    name: 'l3x',
    chainId: 12324,
    explorerUrl: 'https://explorer.l3x.com/',
    explorerApi: {
      url: 'https://explorer.l3x.com/api',
      type: 'blockscout',
    },
    multicallContracts: [],
    minTimestampForTvl: new UnixTime(1714618907),
    coingeckoPlatform: 'l3x',
  },
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      includeInTotal: false,
      address: EthereumAddress('0x4fF3E70f30f0394Ad62428751Fe3858740595908'),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
      ...upgradeability,
    }),
    // prelaunch escrows
    {
      address: EthereumAddress('0x0809F0Ee8e72b2e2069e0f618cBbCB2399D452c7'),
      sinceTimestamp: new UnixTime(1713781465),
      includeInTotal: false,
      ...ESCROW.CANONICAL_EXTERNAL,
      tokens: '*',
      chain: 'arbitrum',
    },
    {
      address: EthereumAddress('0x0809F0Ee8e72b2e2069e0f618cBbCB2399D452c7'),
      sinceTimestamp: new UnixTime(1713781465),
      includeInTotal: false,
      ...ESCROW.CANONICAL_EXTERNAL,
      tokens: '*',
      chain: 'linea',
    },
    {
      address: EthereumAddress('0x0809F0Ee8e72b2e2069e0f618cBbCB2399D452c7'),
      sinceTimestamp: new UnixTime(1713781465),
      includeInTotal: false,
      ...ESCROW.CANONICAL_EXTERNAL,
      tokens: '*',
      chain: 'mode',
    },
    {
      address: EthereumAddress('0x0809F0Ee8e72b2e2069e0f618cBbCB2399D452c7'),
      sinceTimestamp: new UnixTime(1713781465),
      includeInTotal: false,
      ...ESCROW.CANONICAL_EXTERNAL,
      tokens: '*',
      chain: 'blast',
    },
  ],
  nonTemplatePermissions: [
    {
      name: 'RollupOwnerEOA',
      accounts: discovery.getAccessControlRolePermission(
        'UpgradeExecutor',
        'EXECUTOR_ROLE',
      ),
      description:
        'This address has the Executor role and can upgrade the rollup contracts (via ProxyAdmin) without delay, potentially stealing all funds.',
    },
  ],
})
