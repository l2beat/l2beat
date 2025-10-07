import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { DERIVATION, SOA } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

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
  display: {
    name: 'Ink',
    slug: 'ink',
    stateValidationImage: 'opfp',
    description:
      'Ink is an Optimistic Rollup built with the OP Stack by Kraken exchange.',
    stacks: ['OP Stack'],
    links: {
      websites: ['https://inkonchain.com/en-US'],
      documentation: ['https://docs.inkonchain.com'],
      explorers: [
        'https://explorer.inkonchain.com',
        'https://okx.com/en-au/web3/explorer/inkchain',
      ],
      bridges: ['https://inkonchain.com/bridge'],
      repositories: ['https://github.com/inkonchain'],
      socialMedia: [
        'https://x.com/inkonchain',
        'https://discord.com/invite/inkonchain',
        'https://t.me/inkonchain',
      ],
      rollupCodes: 'https://rollup.codes/ink',
    },
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
