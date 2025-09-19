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

const discovery = new ProjectDiscovery('cyber')
const genesisTimestamp = UnixTime(1713428569)
const l2OutputOracle = discovery.getContract('L2OutputOracle')
const sequencerInbox = ChainSpecificAddress.address(
  discovery.getContractValue<ChainSpecificAddress>(
    'SystemConfig',
    'sequencerInbox',
  ),
)
const sequencerAddress = ChainSpecificAddress.address(
  discovery.getContractValue<ChainSpecificAddress>(
    'SystemConfig',
    'batcherHash',
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

export const cyber: ScalingProject = opStackL2({
  ecosystemInfo: {
    id: ProjectId('superchain'),
    isPartOfSuperchain: false,
  },
  addedAt: UnixTime(1713364684), // 2024-04-17T14:38:04Z
  associatedTokens: ['CYBER'],
  discovery,
  additionalBadges: [BADGES.RaaS.AltLayer],
  additionalPurposes: ['Social'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'Cyber',
    slug: 'cyber',
    architectureImage: 'opstack-dachallenge',
    description:
      'Cyber is a chain designed for social applications using an implementation of OP Plasma with DA challenges.',
    links: {
      websites: ['https://cyber.co/'],
      bridges: [
        'https://cyber-bridge.alt.technology/',
        'https://cyber.co/stake',
        'https://wallet.cyber.co/',
      ],
      documentation: ['https://docs.cyber.co/'],
      explorers: ['https://cyberscan.co/', 'https://7560.routescan.io/'],
      repositories: ['https://github.com/cyberconnecthq'],
      socialMedia: [
        'https://twitter.com/cyberconnecthq',
        'https://discord.com/invite/cUc8VRGmPs',
        'https://cyber.co/blog',
      ],
    },
  },
  daProvider: DACHALLENGES_DA_PROVIDER(
    daChallengeWindow,
    daResolveWindow,
    'https://github.com/ethereum-optimism/optimism/releases/tag/v1.9.4',
    DA_LAYERS.OP_ALT_DA,
  ), // source: altlayer on telegram
  chainConfig: {
    name: 'cyber',
    chainId: 7560,
    explorerUrl: 'https://cyberscan.co',
    coingeckoPlatform: 'cyber',
    sinceTimestamp: UnixTime(1713428569), // block 1 ts
    multicallContracts: [
      {
        sinceBlock: 1,
        batchSize: 150,
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        version: '3',
      },
    ],
    apis: [
      {
        type: 'rpc',
        url: 'https://cyber.alt.technology/',
        callsPerMinute: 300,
      },
      {
        type: 'routescan',
        url: 'https://api.routescan.io/v2/network/mainnet/evm/7560/etherscan/api',
      },
    ],
  },
  genesisTimestamp,
  isNodeAvailable: 'UnderReview',
  nonTemplateTrackedTxs: [
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'transfer',
        from: EthereumAddress('0xf0748C52EDC23135d9845CDFB91279Cf61ee14b4'), // old sequencer
        to: sequencerInbox,
        sinceTimestamp: genesisTimestamp,
        untilTimestamp: UnixTime(1743843035),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'transfer',
        from: sequencerAddress,
        to: sequencerInbox,
        sinceTimestamp: UnixTime(1743843035),
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
    name: 'CyberDA',
    description:
      'CyberDA is a data availability solution using data availability challenges (DA Challenges).',
    fallback: DA_LAYERS.ETH_CALLDATA,
    challengeMechanism: 'DA Challenges',
    technology: {
      description: `
## Architecture
![CyberDA layer](/images/da-layer-technology/cyberda/architecture.png#center)

## Data Availability Challenges
Cyber relies on DA challenges for data availability. 
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
          text: 'the sequencer posts an invalid data availability commitment and there are no challengers.',
        },
        {
          category: 'Funds can be lost if',
          text: 'the sequencer posts an invalid data availability commitment, and they are able to outspend the challengers.',
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
