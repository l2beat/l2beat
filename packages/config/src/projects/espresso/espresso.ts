import {
  type ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  DaCommitteeSecurityRisk,
  DaEconomicSecurityRisk,
  DaFraudDetectionRisk,
  DaRelayerFailureRisk,
  DaUpgradeabilityRisk,
} from '../../common'
import { linkByDA } from '../../common/linkByDA'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('espresso')

export const espresso: BaseProject = {
  id: ProjectId('espresso'),
  slug: 'espresso-da',
  name: 'Espresso DA',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2024-09-03')),
  // data
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'Espresso DA is a three-layer data availability (DA) solution based on the HotShot consensus.',
    links: {
      websites: ['https://espressosys.com/'],
      documentation: [
        'https://docs.espressosys.com/',
        'https://docs.espressosys.com/network/espresso-architecture/the-espresso-network/internal-functionality/light-client',
      ],
      repositories: [
        'https://github.com/espressosystems/',
        'https://github.com/EspressoSystems/espresso-sequencer/tree/main/contracts',
      ],
      explorers: ['https://explorer.main.net.espresso.network/'],
      socialMedia: [
        'https://x.com/EspressoSys',
        'https://discord.com/invite/YHZPk5dbcq',
        'https://medium.com/@espressosys',
      ],
    },
    badges: [],
  },
  trackedTxsConfig: [
    // V1 newFinalizedState(tuple, tuple) — deprecated by V2 upgrade
    {
      projectId: ProjectId('espresso'),
      sinceTimestamp: 1704700211,
      untilTimestamp: 1772483759, // 2026-03-02T20:35:59Z V2 upgrade
      type: 'liveness',
      eventIdentity: { type: 'transactionHash' },
      subtype: 'proofSubmissions',
      params: {
        formula: 'functionCall',
        address: EthereumAddress('0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458'),
        selector: '0x2063d4f7',
        signature: 'function newFinalizedState(tuple newState, tuple proof)',
      },
    },
    {
      projectId: ProjectId('espresso'),
      sinceTimestamp: 1704700211,
      untilTimestamp: 1772483759,
      type: 'l2costs',
      subtype: 'proofSubmissions',
      params: {
        formula: 'functionCall',
        address: EthereumAddress('0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458'),
        selector: '0x2063d4f7',
        signature: 'function newFinalizedState(tuple newState, tuple proof)',
      },
    },
    // V2 newFinalizedState(tuple, tuple, tuple) — brief window between V2 and V3 upgrades (~1h45m, likely no txs)
    {
      projectId: ProjectId('espresso'),
      sinceTimestamp: 1772483759, // 2026-03-02T20:35:59Z V2 upgrade
      untilTimestamp: 1772490059, // 2026-03-02T22:20:59Z V3 upgrade
      type: 'liveness',
      eventIdentity: { type: 'transactionHash' },
      subtype: 'proofSubmissions',
      params: {
        formula: 'functionCall',
        address: EthereumAddress('0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458'),
        selector: '0x757c37ad',
        signature:
          'function newFinalizedState(tuple newState, tuple nextStakeTable, tuple proof)',
      },
    },
    {
      projectId: ProjectId('espresso'),
      sinceTimestamp: 1772483759,
      untilTimestamp: 1772490059,
      type: 'l2costs',
      subtype: 'proofSubmissions',
      params: {
        formula: 'functionCall',
        address: EthereumAddress('0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458'),
        selector: '0x757c37ad',
        signature:
          'function newFinalizedState(tuple newState, tuple nextStakeTable, tuple proof)',
      },
    },
    // V3 newFinalizedState(tuple, tuple, uint256, tuple) — active since V3 upgrade
    {
      projectId: ProjectId('espresso'),
      sinceTimestamp: 1772490059, // 2026-03-02T22:20:59Z V3 upgrade
      type: 'liveness',
      eventIdentity: { type: 'transactionHash' },
      subtype: 'proofSubmissions',
      params: {
        formula: 'functionCall',
        address: EthereumAddress('0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458'),
        selector: '0xaabd5db3',
        signature:
          'function newFinalizedState(tuple newState, tuple nextStakeTable, uint256 newAuthRoot, tuple proof)',
      },
    },
    {
      projectId: ProjectId('espresso'),
      sinceTimestamp: 1772490059,
      type: 'l2costs',
      subtype: 'proofSubmissions',
      params: {
        formula: 'functionCall',
        address: EthereumAddress('0x95Ca91Cea73239b15E5D2e5A74d02d6b5E0ae458'),
        selector: '0xaabd5db3',
        signature:
          'function newFinalizedState(tuple newState, tuple nextStakeTable, uint256 newAuthRoot, tuple proof)',
      },
    },
  ],
  daLayer: {
    type: 'Public Blockchain',
    systemCategory: 'public',
    technology: {
      description: readProjectMarkdown('espresso', 'daLayerTechnology'),
    },
    usedWithoutBridgeIn: linkByDA({
      layer: ProjectId('espresso'),
      bridge: undefined,
    }),
    risks: {
      economicSecurity: DaEconomicSecurityRisk.OnChainNotSlashable('ESP'),
      fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
    },
    economicSecurity: {
      token: {
        symbol: 'ESP',
        decimals: 18,
        coingeckoId: 'espresso',
      },
    },
    throughput: [
      {
        size: 1000000, // 1 MB max_block_size (from genesis config)
        frequency: 2, // ~2s calculated average block time (HotShot has no fixed block time)
        sinceTimestamp: 1731283200, // 2024-11-11
      },
    ],
    validators: {
      type: 'dynamic',
    },
  },
  daBridge: {
    name: 'HotShot Light Client',
    daLayer: ProjectId('espresso'),
    relayerType: {
      value: 'Permissioned',
      sentiment: 'warning',
      description:
        'Only whitelisted relayers can post attestations to this bridge.',
    },
    validationType: {
      value: 'Validity Proof',
      description:
        'The DA attestation requires onchain SNARK proof verification to be accepted by the bridge. Operators signatures and their corresponding stake are verified as part of the proof.',
    },
    technology: {
      description: readProjectMarkdown('espresso', 'daBridgeTechnology'),
      references: [
        {
          title: 'Light Client Functionality',
          url: 'https://docs.espressosys.com/network/espresso-architecture/the-espresso-network/internal-functionality',
        },
        {
          title: 'Espresso Github Repository',
          url: 'https://github.com/EspressoSystems/espresso-sequencer/tree/main/contracts',
        },
      ],
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the DA bridge accepts an incorrect or malicious data commitment provided by 2/3 of validators.',
        },
        {
          category: 'Funds can be frozen if',
          text: 'excluding L2-specific DA fallback - the permissioned relayers are unable to submit DA commitments to the Light Client contract.',
        },
      ],
    },
    // dac: {
    //   requiredMembers: 67, // 2/3 + 1
    //   membersCount: 100, // max allowed node operators
    //   knownMembers: [
    //     // key mapping: https://docs.google.com/spreadsheets/d/1GB9HYE7T25QLJQoa2TuA4c43oHk-t8uWkychRNuMcpg/edit?gid=0#gid=0
    //     // Commented out: validator set is now permissionless PoS (top 100 by ESP stake)
    //   ],
    // },
    usedIn: linkByDA({
      layer: ProjectId('espresso'),
      bridge: ProjectId('espresso'),
    }),
    risks: {
      committeeSecurity:
        DaCommitteeSecurityRisk.RobustAndDiverseCommittee('Validator set'),
      upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(),
      relayerFailure: DaRelayerFailureRisk.NoMechanism,
    },
  },
  contracts: {
    addresses: discovery.getDiscoveredContracts(),
    risks: [
      {
        category: 'Funds can be lost if',
        text: 'the bridge contract or its dependencies receive a malicious code upgrade. There is no delay on code upgrades.',
      },
    ],
    zkVerifiers: getVerifiers(),
  },
  permissions: discovery.getDiscoveredPermissions(),
  milestones: [
    {
      title: 'Espresso transitions to Proof-of-Stake',
      url: 'https://paragraph.com/@espressofndn/proof-of-stake-upgrade-begins',
      date: '2026-03-04T00:00:00Z',
      description:
        'Espresso transitions from a permissioned validator set to permissionless proof-of-stake secured by staked ESP tokens.',
      type: 'general',
    },
    {
      title: 'EspressoDA launch on mainnet',
      url: 'https://medium.com/@espressosys/espresso-mainnet-0-is-live-deedc2505081',
      date: '2024-11-11T00:00:00Z',
      description:
        'EspressoDA mainnet launches with a permissioned set of node operators.',
      type: 'general',
    },
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
}

// should return the address of deployed plonk verifier library
function getVerifiers(): ChainSpecificAddress[] {
  const libraries = discovery.getContractValue<ChainSpecificAddress[]>(
    'HotShotLightClient',
    '$libraries',
  )
  return [libraries[1]]
}
