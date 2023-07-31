import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS, RISK_VIEW, TECHNOLOGY, UNDER_REVIEW_RISK_VIEW, makeBridgeCompatible } from './common'
import { Layer2 } from './types'
import { HARDCODED } from '../discovery/values/hardcoded'

const discovery = new ProjectDiscovery('publicgoodsnetwork')

const upgradesProxy = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

export const publicgoodsnetwork: Layer2 = {
  type: 'layer2',
  id: ProjectId('publicgoodsnetwork'),
  display: {
    name: 'Public Goods Network',
    slug: 'publicgoodsnetwork',
    description:
      'Public Goods Network is an OP stack chain focused on funding public goods.',
    purpose: 'Universal',
    category: 'Optimistic Rollup',
    provider: 'Optimism',
    links: {
      websites: ['https://publicgoods.network/'],
      apps: ['https://bridge.publicgoods.network/'],
      documentation: ['https://docs.publicgoods.network/'],
      explorers: ['https://explorer.publicgoods.network'],
      repositories: [
        'https://github.com/supermodularxyz/pgn-monorepo',
        'https://github.com/supermodularxyz/pgn-docs',
      ],
      socialMedia: ['https://twitter.com/pgn_eth'],
    },
    activityDataSource: 'Blockchain RPC',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xb26Fd985c5959bBB382BAFdD0b879E149e48116c'),
        sinceTimestamp: new UnixTime(1686068903),
        tokens: ['ETH'],
        description: 'Main entry point for users depositing ETH.',
        ...upgradesProxy,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b'),
        sinceTimestamp: new UnixTime(1624401464),
        tokens: '*',
        description:
          'Main entry point for users depositing ERC20 tokens that do not require custom gateway.',
        ...upgradesProxy,
      }),
    ],
    transactionApi: {
      type: 'rpc',
      startBlock: 1,
      url: 'https://rpc.publicgoods.network',
      callsPerMinute: 1500,
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_NONE,
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      sources: [
        {
          contract: 'OptimismPortal',
          references: [
            'https://etherscan.io/address/0x436e9FC7894e26718637f086d42B4a06439C8ae0#code#F1#L434',
          ],
        }
      ]
    },
    upgradeability: {
      ...RISK_VIEW.UPGRADABLE_YES,
      sources: [
        {
          contract: 'OptimismPortal',
          references: [
            'https://etherscan.io/address/0xb26Fd985c5959bBB382BAFdD0b879E149e48116c',
          ],
        }
      ]
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE(
        HARDCODED.PUBLICGOODSNETWORK.SEQUENCING_WINDOW_SECONDS,
      ),
      sources: [
        {
          contract: 'OptimismPortal',
          references: [
            'https://etherscan.io/address/0x436e9FC7894e26718637f086d42B4a06439C8ae0#code#F1#L434',
          ],
        }
      ]
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
      sources: [
        {
          contract: 'L2OutputOracle',
          references: [
            'https://etherscan.io/address/0x76983dfED43C7ae7ebB592A92Be2BE972cAE4348#code#F1#L186',
          ]
        }
      ]
    },
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  })
  stage: {
    stage: 'UnderReview',
  },
  technology: TECHNOLOGY.UPCOMING,
  contracts: CONTRACTS.EMPTY,
}
