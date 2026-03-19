import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
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

const discovery = new ProjectDiscovery('espresso')

export const espresso: BaseProject = {
  id: ProjectId('espresso'),
  slug: 'espresso-da',
  name: 'Espresso DA',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2024-09-03')),
  // tags
  isDaLayer: true,
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
      description: `
## Architecture
![EspressoDA architecture](/images/da-layer-technology/espressoDA/architecture.png#center)

## Consensus

Espresso uses the HotShot consensus protocol, a communication-efficient proof-of-stake system that is Byzantine Fault Tolerant (BFT).
The validator set is permissionless: anyone can stake ESP tokens and the top 100 validators by total stake form the active consensus set, which is dynamically adjusted at epoch boundaries.
Built on HotStuff-2, it achieves linear communication complexity using a pacemaker module to synchronize views and ensures safety and liveness as long as over two-thirds of the stake is controlled by honest nodes.
Although validators are required to stake ESP to participate, there is currently no slashing mechanism in place for misbehaving nodes.

HotShot operates in a view-by-view manner, where each view designates a leader and an external builder. 
During a view, the consensus proposer finalizes a block with a certificate of availability by utilizing Espresso DA for data availability.

## Data Availability Certificate

Once the proposer sends data to HotShot node operators, they initiate Espresso DA's three layers of data availability:

- **VID Layer**: Disperses erasure-coded data to all nodes. VID layer nodes only store chunks of the data.
- **DA Committee Layer**: Uploads the data and commitment to a small DA committee. Every node in the committee stores the full data.
- **CDN Layer**: Uploads the full data to a content delivery network (CDN). 

Once nodes receive and store the data, they return votes to the proposer. DAVotes are votes from committee nodes storing the full data, while QuorumVotes are votes from nodes storing erasure-coded shares of the data.
A DA certificate consists of two components, the retrievability certificate and the optimistic DAC certificate:

- **Retrievability Certificate**: Formed when the DA leader collects 2/3 + 1 QuorumVotes.
- **Optimistic DAC Certificate**: Formed when the DA leader gathers 2/3 + 1 DAVotes from the DA committee. Currently, the committee size is 21 members, so the threshold is 15 signatures.


Once the DAC is formed, the DA leader stops broadcasting data to the nodes.

## L2s Data Availability

The life cycle of L2 transactions begins with users submitting transactions to the Espresso DA mempool through an RPC endpoint, or directly to the block builder private mempool, including a namespace ID to indicate the target L2 rollup. 
A DA leader collects and disperses these transactions across Espresso DA's layers to form a DA certificate. The leader then broadcasts a proposal with a vector commitment for the transactions to the HotShot consensus layer. 
The finalization of the block commitment in HotShot establishes data availability for the corresponding transactions.
After block finalization in HotShot, the relayer propagates the commitment and quorum certificates to the L1 Light Client contract, which verifies the certificate and the HotShot state SNARK proof via the verifyProof function. 

![EspressoDA architecture with L2s](/images/da-layer-technology/espressoDA/architectureL2.png#center)

Users can retrieve data by querying any of Espresso DA's layers, though the VID layer is slower due to the reconstruction of erasure-coded shares. L2s can also use a verifyInclusion function on an L1 light client smart contract to confirm a blob's inclusion in the Espresso DA HotShot chain.
 `,
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
      description: `
      ## Architecture
      The Light Client contract serves as the DA bridge for the Espresso DA solution and is responsible for storing the HotShot consensus state on Ethereum.
      
      When HotShot nodes reach consensus, they sign the updated HotShot state using Schnorr signatures, which indicate agreement with the state of the proposed block. These signatures are stored locally on the DA layer nodes.
      
      A prover retrieves these signatures and generates a SNARK proof, which is sent to the LightClient contract's newFinalizedState function. The LightClient contract verifies this proof using its verifyProof method, which accepts the proof and a set of public inputs, such as the blockHeight and the Merkle root of all sequenced blocks. 
      
      The proof should contain the HotShot state, the stake table information, and the list of Schnorr signatures from the HotShot nodes that formed a quorum and reached consensus on the state, and the new state is accepted only if the proof passes verification.
  
      Currently, attestations are relayed to the Light Client every 12 hours.
    `,
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
