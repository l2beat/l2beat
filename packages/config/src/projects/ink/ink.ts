import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { DERIVATION, SOA } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getOpStackDaTracking, opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('ink')
const genesisTimestamp = UnixTime(1733498411)

export const ink: ScalingProject = opStackL2({
  ecosystemInfo: {
    id: ProjectId('superchain'),
    isPartOfSuperchain: true,
  },
  addedAt: UnixTime(1734480000), // 2024-10-18T00:00:00Z
  additionalBadges: [BADGES.RaaS.Gelato],
  discovery,
  daTracking: [
    {
      type: 'ethereum',
      daLayer: ProjectId('ethereum'),
      sinceBlock: 21344310,
      untilBlock: 25631821, // batcherHash rotation
      inbox: EthereumAddress('0x005969bf0EcbF6eDB6C47E5e94693b1C3651Be97'),
      sequencers: [
        EthereumAddress('0x500d7Ea63CF2E501dadaA5feeC1FC19FE2Aa72Ac'),
      ],
    },
    getOpStackDaTracking(discovery, {
      sinceBlock: 25631821, // batcherHash rotation
    }),
  ],
  display: {
    name: 'Ink',
    aliases: ['Kraken'],
    slug: 'ink',
    stateValidationImage: 'opfp',
    description:
      'Ink is an Optimistic Rollup built with the OP Stack by Kraken exchange.',
    stacks: ['OP Stack'],
    links: {
      websites: ['https://inkonchain.com'],
      documentation: ['https://docs.inkonchain.com'],
      explorers: [
        'https://explorer.inkonchain.com',
        'https://okx.com/en-au/web3/explorer/inkchain',
      ],
      bridges: ['https://inkonchain.com/bridge'],
      repositories: ['https://github.com/inkonchain'],
      socialMedia: [
        'https://x.com/inkonchain',
        'https://warpcast.com/inkonchain',
        'https://t.me/inkonchain',
      ],
      other: ['https://rollup.codes/ink', 'https://growthepie.com/chains/ink'],
    },
  },
  interopConfig: {
    name: 'Ink Canonical',
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
        chain: 'ink',
        plugin: 'opstack',
        bridgeType: 'lockAndMint',
      },
      {
        chain: 'ink',
        plugin: 'opstack-standardbridge',
        bridgeType: 'lockAndMint',
      },
    ],
    type: 'canonical',
  },
  genesisTimestamp,
  stateDerivation: DERIVATION.OPSTACK('INK'),
  isNodeAvailable: true,
  scopeOfAssessment: {
    inScope: [
      SOA.l1Contracts,
      SOA.l2Contracts,
      SOA.gasToken,
      SOA.derivationSpec,
      SOA.sourceCodeToProgramHash,
    ],
    notInScope: [SOA.specToSourceCode, SOA.sequencerPolicy, SOA.nonGasTokens],
  },
  hasSuperchainScUpgrades: true,
  hasProperSecurityCouncil: true,
  nodeSourceLink:
    'https://github.com/ethereum-optimism/optimism/tree/develop/op-node',
  chainConfig: {
    name: 'ink',
    chainId: 57073,
    explorerUrl: 'https://explorer.inkonchain.com',
    sinceTimestamp: genesisTimestamp,
    coingeckoPlatform: 'ink',
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 1,
        version: '3',
      },
    ],
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc-gel.inkonchain.com',
        callsPerMinute: 300,
      },
      {
        type: 'blockscout',
        url: 'https://explorer.inkonchain.com/api',
      },
      {
        type: 'blockscoutV2',
        url: 'https://explorer.inkonchain.com/api/v2/',
      },
    ],
  },
  milestones: [
    {
      title: 'Ink becomes Stage 1',
      url: 'https://app.blocksec.com/explorer/tx/eth/0x20fdc1a418ba706e35ade3a2bf1e4c9198c3c62e79d1b688fd951b900d065c27',
      date: '2025-01-22T00:00:00Z',
      type: 'general',
    },
  ],
})
