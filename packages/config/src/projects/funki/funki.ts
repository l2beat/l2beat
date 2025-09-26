import {
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  DA_LAYERS,
  DaCommitteeSecurityRisk,
  DaEconomicSecurityRisk,
  DaFraudDetectionRisk,
  DaRelayerFailureRisk,
  DaUpgradeabilityRisk,
  REASON_FOR_BEING_OTHER,
} from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { DACHALLENGES_DA_PROVIDER, opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('funki')
const genesisTimestamp = UnixTime(1721211095)
const l2OutputOracle = discovery.getContract('L2OutputOracle')
const sequencerInbox = ChainSpecificAddress.address(
  discovery.getContractValue<ChainSpecificAddress>(
    'SystemConfig',
    'sequencerInbox',
  ),
)

const daChallengeWindow = formatSeconds(
  discovery.getContractValue<number>(
    'DataAvailabilityChallenge',
    'challengeWindow',
  ) * 12, // in blocks, to seconds
)

const daResolveWindow = formatSeconds(
  discovery.getContractValue<number>(
    'DataAvailabilityChallenge',
    'resolveWindow',
  ) * 12, // in blocks, to seconds
)

export const funki: ScalingProject = opStackL2({
  ecosystemInfo: {
    id: ProjectId('superchain'),
    isPartOfSuperchain: false,
  },
  capability: 'universal',
  addedAt: UnixTime(1728289959), // 2024-10-07T08:32:39Z
  additionalBadges: [BADGES.RaaS.AltLayer],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'Funki',
    slug: 'funki',
    description:
      'Funki chain is an OP Stack Optimium on Ethereum reimagining the blockchain experience as an interconnected world brimming with wonder, adventure, and fun.',
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    stacks: ['OP Stack'],
    links: {
      websites: ['https://funkichain.com'],
      bridges: ['https://funkichain.com/bridge', 'https://funkichain.com/swap'],
      documentation: ['https://docs.funkichain.com/'],
      explorers: ['https://explorer.funkichain.com/'],
      repositories: ['https://github.com/funkichain'],
      socialMedia: [
        'https://x.com/funkichain',
        'https://facebook.com/funkichain',
        'https://instagram.com/funkichain',
        'https://t.me/funkichain',
      ],
    },
  },
  daProvider: DACHALLENGES_DA_PROVIDER(
    daChallengeWindow,
    daResolveWindow,
    'https://github.com/ethereum-optimism/optimism/releases/tag/v1.7.7',
    DA_LAYERS.OP_ALT_DA,
  ), // source: altlayer on telegram
  isNodeAvailable: 'UnderReview',
  chainConfig: {
    name: 'funki',
    chainId: 33979,
    explorerUrl: 'https://explorer.funkichain.com',
    sinceTimestamp: genesisTimestamp,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc-mainnet.funkichain.com',
        callsPerMinute: 300,
      },
    ],
  },
  discovery,
  genesisTimestamp,
  nonTemplateTrackedTxs: [
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'transfer',
        from: EthereumAddress('0x73c98Cf34AF1f7D798e8e6f34b16037530Bffc41'), // old sequencer
        to: sequencerInbox,
        sinceTimestamp: genesisTimestamp,
        untilTimestamp: UnixTime(1743854015),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'transfer',
        to: sequencerInbox,
        sinceTimestamp: UnixTime(1743854015),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'functionCall',
        address: ChainSpecificAddress.address(l2OutputOracle.address),
        selector: '0x9aaab648',
        functionSignature:
          'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1Blockhash, uint256 _l1BlockNumber)',
        sinceTimestamp: genesisTimestamp,
      },
    },
  ],
  customDa: {
    type: 'DA Challenges',
    name: 'Altlayer DA',
    description:
      'Altlayer DA is a data availability solution using data availability challenges (DA Challenges).',
    challengeMechanism: 'DA Challenges',
    fallback: DA_LAYERS.ETH_CALLDATA,
    technology: {
      description: `
  ## Architecture
  ![gmnetworkDA layer](/images/da-layer-technology/gmnetworkda/architecture.png#center)
  
  ## Data Availability Challenges
  The project relies on DA challenges for data availability. 
  The DA Provider submits an input commitment on Ethereum, and users can request the data behind the commitment off-chain from the DA Provider.
  If a DA challenger finds that the data behind a tx data commitment is not available, they can submit a challenge which requires locking a bond within ${daChallengeWindow}. 
  A challenge can be resolved by publishing the preimage data within an additional ${daResolveWindow}.
  In such case, a portion of the challenger bond is burned, with the exact amount estimated as the cost incurred by the resolver to publish the full data, meaning that the resolver and challenger will approximately lose the same amount of funds.
  The system is not secure if the malicious sequencer is able to outspend the altruistic challengers. 
  If instead, after a challenge, the preimage data is not published, the chain reorgs to the last fully derivable state.
  
  ## DA Bridge
  Only hashes of data batches are posted as DA commitments to an EOA on Ethereum.
  However, there is a mechanism that allows users to challenge unavailability of data.
      `,
      references: [
        {
          title: 'Alt-DA Specification',
          url: 'https://github.com/ethereum-optimism/specs/blob/main/specs/experimental/alt-da.md',
        },
        {
          title: 'Security Considerations - Ethresear.ch ',
          url: 'https://ethresear.ch/t/universal-plasma-and-da-challenges/18629',
        },
      ],
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'the sequencer posts an invalid data availability certificate and there are no challengers.',
        },
        {
          category: 'Funds can be lost if',
          text: 'the sequencer posts an invalid data availability certificate, and he is able to outspend the challengers.',
        },
      ],
    },
    risks: {
      economicSecurity: DaEconomicSecurityRisk.DAChallengesNoFunds,
      fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
      committeeSecurity: DaCommitteeSecurityRisk.NoCommitteeSecurity(),
      upgradeability: DaUpgradeabilityRisk.LowOrNoDelay(), // no delay
      relayerFailure: DaRelayerFailureRisk.NoMechanism,
    },
  },
})
