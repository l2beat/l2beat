import { ProjectId, UnixTime } from '@l2beat/types'

import { CONTRACTS } from '../layer2s/common'
import { Bridge } from './types'

export const polynetwork: Bridge = {
  type: 'bridge',
  id: ProjectId('polynetwork'),
  display: {
    name: 'Polynetwork',
    slug: 'polynetwork',
    links: {
      websites: ['https://bridge.poly.network/', 'https://poly.network/'],
      apps: ['https://bridge.poly.network/'],
      socialMedia: [
        'https://twitter.com/PolyNetwork2',
        'https://polynetwork.medium.com/',
        'https://www.youtube.com/channel/UC4vFRyVgvK7RnlkkLDmp23w',
        'https://discord.gg/y6MuEnq',
      ],
      repositories: ['https://github.com/polynetwork'],
      documentation: [
        'https://dev-docs.poly.network/',
        'https://github.com/polynetwork/docs',
      ],
    },
  },
  config: {
    escrows: [
      {
        address: '0x250e76987d838a75310c34bf422ea9f1AC4Cc906',
        sinceTimestamp: new UnixTime(1599099893),
        tokens: [
          'ETH',
          'USDT',
          'USDC',
          // 'COW',
          'WBTC',
          'DAI',
          'UNI',
          'SHIB',
          'renBTC',
          'FEI',
        ],
      },
    ],
  },
  technology: {
    category: 'Liquidity Network',
    destination: ['Various'], // Careful, on UI, destination options change based on selected asset
    // e.g. ETH supports only some niche chains, while FEI supports e.g. BNB.
    // This probably depends on liquidity in the pools.
  },
  contracts: {
    addresses: [
      {
        address: '0x81910675dbaf69dee0fd77570bfd07f8e436386a',
        name: 'PolyWrapper',
        description:
          'Entrypoint contract for the bridge. It proxies requests to LockProxy',
        upgradeability: {
          type: 'Custom',
          admin: '0x0E860F44d73F9FDbaF5E9B19aFC554Bf3C8E8A57',
          implementation: '0x250e76987d838a75310c34bf422ea9f1AC4Cc906',
        },
      },
      {
        address: '0x250e76987d838a75310c34bf422ea9f1AC4Cc906',
        name: 'LockProxy',
        description: 'Escrow and proxy contract for the Birdge',
        upgradeability: {
          type: 'Custom',
          admin: '0x8B35064B158634458Fd53A861d68Eb84152E4106',
          implementation: '0x14413419452Aaf089762A0c5e95eD2A13bBC488C',
        },
      },
    ],
    risks: [CONTRACTS.UNVERIFIED_RISK, CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
}
