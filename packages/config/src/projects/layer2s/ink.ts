import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { DERIVATION } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { getStage } from './common/stages/getStage'
import { opStackL2 } from './templates/opStack'

const discovery = new ProjectDiscovery('ink')
const l2Discovery = new ProjectDiscovery('ink', 'ink')
const genesisTimestamp = new UnixTime(1733498411)

export const ink: Layer2 = opStackL2({
  addedAt: new UnixTime(1729797861), // 2024-10-24T21:24:21Z
  additionalBadges: [Badge.RaaS.Gelato],
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
    minTimestamp: new UnixTime(1733502012),
    genesisTimestamp: new UnixTime(1733498411),
    l2BlockTimeSeconds: 2,
    lag: 0,
    stateUpdate: 'disabled',
  },
  genesisTimestamp,
  stateDerivation: DERIVATION.OPSTACK('INK'),
  isNodeAvailable: true,
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
  rpcUrl: 'https://rpc-gel.inkonchain.com',
  chainConfig: {
    name: 'ink',
    chainId: 57073,
    blockscoutV2ApiUrl: 'https://explorer.inkonchain.com/api/v2/',
    explorerUrl: 'https://explorer.inkonchain.com',
    explorerApi: {
      url: 'https://explorer.inkonchain.com/api',
      type: 'blockscout',
    },
    minTimestampForTvl: genesisTimestamp,
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 1,
        version: '3',
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
