import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { DA_LAYERS, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { EIGENDA_DA_PROVIDER, opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('rise')

export const rise: ScalingProject = opStackL2({
  addedAt: UnixTime(1784639012), // 2026-07-21T13:03:32Z
  discovery,
  capability: 'universal',
  additionalBadges: [BADGES.Stack.OPSuccinct],
  // the deployed SP1 programs are reproducibly built from the eigenda-featured
  // fork (v3.4.1-rise.7), whose range program verifies EigenDA DA certificates
  // in-circuit via hokulea and canoe (see programHashes.ts)
  daProvider: EIGENDA_DA_PROVIDER(true, DA_LAYERS.ETH_BLOBS),
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  proverSourceLink: 'https://github.com/succinctlabs/sp1',
  display: {
    name: 'RISE',
    slug: 'rise',
    description:
      'RISE is a low-latency Optimium built on the OP Stack, using the OP Succinct Lite ZK fault proof system and posting data to EigenDA. It targets real-time trading applications through its RISEx exchange.',
    stacks: ['OP Stack'],
    links: {
      websites: ['https://risechain.com/'],
      bridges: ['https://portal.risechain.com/bridge'],
      documentation: ['https://docs.risechain.com/'],
      explorers: ['https://explorer.risechain.com/'],
      repositories: ['https://github.com/risechain'],
      socialMedia: [
        'https://x.com/risechain',
        'https://t.me/risexannouncement',
        'https://blog.risechain.com/',
      ],
    },
  },
  chainConfig: {
    name: 'rise',
    chainId: 4153,
    explorerUrl: 'https://explorer.risechain.com',
    sinceTimestamp: UnixTime(1767605759),
    gasTokens: ['ETH'],
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 0, // genesis predeploy
        version: '3',
      },
    ],
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.risechain.com',
        callsPerMinute: 300,
      },
    ],
  },
  genesisTimestamp: UnixTime(1767605759), // block 0 from the rpc
  // the production node is distributed as closed-source docker images,
  // see https://github.com/risechain/rise-node
  isNodeAvailable: false,
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  milestones: [
    {
      title: 'RISE public mainnet launch',
      url: 'https://blog.risechain.com/rise-launch-philosophy/',
      date: '2026-05-01T00:00:00.00Z',
      description:
        'RISE opens its mainnet (genesis on January 5th 2026) to the public together with the RISEx exchange.',
      type: 'general',
    },
  ],
  nonTemplateDaTracking: [
    {
      type: 'eigen-da',
      daLayer: ProjectId('eigenda'),
      sinceTimestamp: UnixTime(1767607200), // 2026-01-05T10:00:00Z
      customerId: '0x78d5974216f751eb328018f003067f77e8be2fc4',
    },
  ],
  interopConfig: {
    name: 'RISE Canonical',
    durationSplit: {
      lockAndMint: [
        {
          label: 'L1 -> L2',
          transferTypes: [
            'opstack.L1ToL2Transfer',
            'opstack-standardbridge.L1ToL2Transfer',
          ],
        },
        {
          label: 'L2 -> L1',
          transferTypes: [
            'opstack.L2ToL1Transfer',
            'opstack-standardbridge.L2ToL1Transfer',
          ],
        },
      ],
    },
    plugins: [
      {
        chain: 'rise',
        plugin: 'opstack',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'rise',
        plugin: 'opstack-standardbridge',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'canonical',
  },
})
