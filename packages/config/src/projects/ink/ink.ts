import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { DERIVATION, SOA } from '../../common'
import { BADGES } from '../../common/badges'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('ink')
const l2Discovery = new ProjectDiscovery('ink', 'ink')
const genesisTimestamp = UnixTime(1733498411)

export const ink: ScalingProject = opStackL2({
  addedAt: UnixTime(1729797861), // 2024-10-24T21:24:21Z
  additionalBadges: [BADGES.RaaS.Gelato],
  discovery,
  additionalDiscoveries: { ['ink']: l2Discovery },
  display: {
    name: 'Ink',
    slug: 'ink',
    stateValidationImage: 'opfp',
    description:
      'Ink is an Optimistic Rollup built with the OP Stack by Kraken exchange.',
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    links: {
      websites: ['https://inkonchain.com/en-US'],
      explorers: [
        'https://explorer.inkonchain.com',
        'https://okx.com/en-au/web3/explorer/inkchain',
      ],
      repositories: ['https://github.com/inkonchain'],
      socialMedia: [
        'https://x.com/inkonchain',
        'https://discord.com/invite/inkonchain',
        'https://t.me/inkonchain',
      ],
    },
  },
  finality: {
    type: 'OPStack',
    minTimestamp: UnixTime(1733502012),
    genesisTimestamp: UnixTime(1733498411),
    l2BlockTimeSeconds: 2,
    lag: 0,
    stateUpdate: 'disabled',
  },
  genesisTimestamp,
  stateDerivation: DERIVATION.OPSTACK('INK'),
  isNodeAvailable: true,
  scopeOfAssessment: {
    checked: [
      SOA.l1Contracts,
      SOA.l2Contracts,
      SOA.gasToken,
      SOA.derivationSpec,
      SOA.sourceCodeToProgramHash,
    ],
    notChecked: [SOA.specToSourceCode, SOA.sequencerPolicy, SOA.nonGasTokens],
  },

  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        principle: false,
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: true,
        usersHave7DaysToExit: true,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: true,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: true,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink:
        'https://github.com/ethereum-optimism/optimism/tree/develop/op-node',
    },
  ),
  chainConfig: {
    name: 'ink',
    chainId: 57073,
    explorerUrl: 'https://explorer.inkonchain.com',
    sinceTimestamp: genesisTimestamp,
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
        callsPerMinute: 1500,
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
