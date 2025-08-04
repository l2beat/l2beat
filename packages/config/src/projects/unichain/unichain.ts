import {
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { DERIVATION, ESCROW, SOA } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('unichain')
const genesisTimestamp = UnixTime(1730748359)
const chainId = 130

export const unichain: ScalingProject = opStackL2({
  addedAt: UnixTime(1739318400), // 2025-02-11T00:00:00Z
  discovery,
  additionalPurposes: ['Exchange'],
  display: {
    name: 'Unichain',
    slug: 'unichain',
    stateValidationImage: 'opfp',
    description:
      'Unichain, a faster, cheaper L2 designed to be the home for DeFi and the home for multichain liquidity.',
    category: 'Optimistic Rollup',
    stacks: ['OP Stack'],
    links: {
      websites: ['https://unichain.org/'],
      bridges: ['https://unichain.org/bridge'],
      documentation: ['https://docs.unichain.org/docs'],
      explorers: ['https://uniscan.xyz/', 'https://unichain.blockscout.com/'],
      socialMedia: [
        'https://x.com/unichain',
        'https://discord.com/invite/uniswap',
      ],
    },
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
  hasProperSecurityCouncil: true,
  nodeSourceLink:
    'https://github.com/ethereum-optimism/optimism/tree/develop/op-node',
  associatedTokens: ['UNI'],
  nonTemplateExcludedTokens: ['USDC'],
  genesisTimestamp,
  stateDerivation: DERIVATION.OPSTACK('UNICHAIN'),
  isNodeAvailable: true,
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x755610f5Be536Ad7afBAa7c10F3E938Ea3aa1877',
      ),
      tokens: ['wstETH'],
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'wstETH Vault for custom wstETH Gateway. Fully controlled by Lido governance.',
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x1196F688C585D3E5C895Ef8954FFB0dCDAfc566A',
      ),
      tokens: ['USDS', 'sUSDS'],
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'Maker/Sky-controlled vault for USDS and sUSDS bridged with canonical messaging.',
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
