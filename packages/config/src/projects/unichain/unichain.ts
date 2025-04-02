import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { DERIVATION, SOA } from '../../common'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('unichain')
const l2discovery = new ProjectDiscovery('unichain', 'unichain')
const genesisTimestamp = UnixTime(1730748359)

export const unichain: ScalingProject = opStackL2({
  addedAt: UnixTime(1728932992), // 2024-10-14T19:09:00Z
  discovery,
  additionalDiscoveries: { ['unichain']: l2discovery },
  additionalPurposes: ['Exchange'],
  display: {
    name: 'Unichain',
    slug: 'unichain',
    stateValidationImage: 'opfp',
    description:
      'Unichain, a faster, cheaper L2 designed to be the home for DeFi and the home for multichain liquidity.',
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    links: {
      websites: ['https://unichain.org/'],
      apps: ['https://unichain.org/bridge'],
      documentation: ['https://docs.unichain.org/docs'],
      explorers: ['https://uniscan.xyz/'],
      socialMedia: [
        'https://x.com/unichain',
        'https://discord.com/invite/uniswap',
      ],
    },
  },
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
  associatedTokens: ['UNI'],
  finality: {
    type: 'OPStack',
    minTimestamp: genesisTimestamp,
    genesisTimestamp: genesisTimestamp,
    l2BlockTimeSeconds: 1,
    lag: 0,
    stateUpdate: 'disabled',
  },
  nonTemplateExcludedTokens: ['USDC'],
  genesisTimestamp,
  stateDerivation: DERIVATION.OPSTACK('UNICHAIN'),
  isNodeAvailable: true,
  chainConfig: {
    name: 'unichain',
    chainId: 130,
    coingeckoPlatform: 'unichain',
    explorerUrl: 'https://uniscan.xyz',
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 1,
        version: '3',
      },
    ],
    sinceTimestamp: genesisTimestamp,
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet.unichain.org',
        callsPerMinute: 1500,
      },
      { type: 'etherscan', url: 'https://api.uniscan.xyz/api' },
    ],
  },
  milestones: [
    {
      title: 'Unichain Mainnet Launch',
      url: 'https://x.com/unichain/status/1889313993296064770',
      date: '2025-02-12T00:00:00Z',
      type: 'general',
    },
  ],
})
