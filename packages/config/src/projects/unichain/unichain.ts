import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { DERIVATION, ESCROW, SOA } from '../../common'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('unichain')
const l2discovery = new ProjectDiscovery('unichain', 'unichain')
const genesisTimestamp = UnixTime(1730748359)
const chainId = 130

export const unichain: ScalingProject = opStackL2({
  addedAt: UnixTime(1739318400), // 2025-02-11T00:00:00Z
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
  ecosystemInfo: {
    id: ProjectId('superchain'),
  },
  hasSuperchainScUpgrades: true,
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
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0x755610f5Be536Ad7afBAa7c10F3E938Ea3aa1877'),
      tokens: ['wstETH'],
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'wstETH Vault for custom wstETH Gateway. Fully controlled by Lido governance.',
    }),
  ],
  chainConfig: {
    name: 'unichain',
    chainId,
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
      { type: 'etherscan', chainId },
    ],
  },
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://x.com/unichain/status/1889313993296064770',
      date: '2025-02-12T00:00:00Z',
      type: 'general',
    },
  ],
})
