import {
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
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

const discovery = new ProjectDiscovery('xterio')
const genesisTimestamp = UnixTime(1716537433)
const l2OutputOracle = discovery.getContract('L2OutputOracle')
const sequencerInbox = discovery.getContractValue<ChainSpecificAddress>(
  'SystemConfig',
  'sequencerInbox',
)
const sequencerAddress = discovery.getContractValue<ChainSpecificAddress>(
  'SystemConfig',
  'batcherHash',
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

export const xterio: ScalingProject = opStackL2({
  addedAt: UnixTime(1714996778), // 2024-05-06T11:59:38Z
  discovery,
  additionalBadges: [BADGES.DA.CustomDA, BADGES.RaaS.AltLayer],
  additionalPurposes: ['Gaming'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  archivedAt: UnixTime(1745001006),
  display: {
    architectureImage: 'opstack-dachallenge',
    name: 'Xterio Chain',
    slug: 'xterio',
    warning:
      'Deposited/Forced transactions are disabled, a permissioned admin can withdraw all ETH. Xterio chain on ethereum is sunset and funds [are being transferred to Xterio Chain (BNB)](https://info.xter.io/xterio-chain-migration).',
    description:
      'Xterio Chain is an OP stack Optimium on Ethereum. The chain focuses on gaming, high performance and low fees .',
    links: {
      websites: ['https://xter.io/'],
      bridges: ['https://xter.io/', 'https://eth-bridge.xter.io/'],
      documentation: ['https://stack.optimism.io/'],
      explorers: ['https://eth.xterscan.io/'],
      repositories: ['https://github.com/XterioTech'],
      socialMedia: [
        'https://x.com/XterioGames',
        'https://discord.gg/xterio',
        'https://medium.com/@XterioGames',
      ],
    },
  },
  isNodeAvailable: 'UnderReview',
  daProvider: DACHALLENGES_DA_PROVIDER(
    daChallengeWindow,
    daResolveWindow,
    'https://github.com/ethereum-optimism/optimism/releases/tag/op-node%2Fv1.7.5',
    DA_LAYERS.OP_ALT_DA,
  ), // source: altlayer on telegram
  genesisTimestamp,
  chainConfig: {
    name: 'xterio',
    chainId: 2702128,
    apis: [
      {
        type: 'rpc',
        url: 'https://xterio-eth.alt.technology/',
        callsPerMinute: 1500,
      },
    ],
  },
  nonTemplateTrackedTxs: [
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'transfer',
        from: EthereumAddress('0x7d6251D49A102a330CfB46d132982781620700Cb'), // old sequencer
        to: ChainSpecificAddress.address(sequencerInbox),
        sinceTimestamp: genesisTimestamp,
        untilTimestamp: UnixTime(1743862115),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'transfer',
        from: ChainSpecificAddress.address(sequencerAddress),
        to: ChainSpecificAddress.address(sequencerInbox),
        sinceTimestamp: UnixTime(1743862115),
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
    name: 'XterioDA',
    description:
      'XterioDA is a data availability solution using data availability challenges (DA Challenges).',
    fallback: DA_LAYERS.ETH_CALLDATA,
    challengeMechanism: 'DA Challenges',
    technology: {
      description: `
## Architecture
![XterioDA layer](/images/da-layer-technology/xterioda/architecture.png#center)

## Data Availability Challenges
Xterio relies on DA challenges for data availability. 
The DA Provider submits an input commitment on Ethereum, and users can request the data behind the commitment off-chain from the DA Provider.
If a DA challenger finds that the data behind a tx data commitment is not available, they can submit a challenge which requires locking a bond within ${daChallengeWindow}. 
A challenge can be resolved by publishing the preimage data within an additional ${daResolveWindow}.
In such case, a portion of the challenger bond is burned, with the exact amount estimated as the cost incurred by the resolver to publish the full data, meaning that the resolver and challenger will approximately lose the same amount of funds.
The system is not secure if the malicious sequencer is able to outspend the altruistic challengers. 
If instead, after a challenge, the preimage data is not published, the chain reorgs to the last fully derivable state.

## DA Bridge
Only hashes of data batches are posted as DA commitments to an EOA on Ethereum. However, there is a mechanism that allows users to challenge unavailability of data.
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
