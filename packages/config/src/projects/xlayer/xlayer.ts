import {
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { formatEther } from 'ethers/lib/utils'
import { REASON_FOR_BEING_OTHER, RISK_VIEW } from '../../common'
import { BADGES } from '../../common/badges'
import { PROGRAM_HASHES } from '../../common/programHashes'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { agglayer } from '../../templates/agglayer'
import { getSP1Verifiers } from '../../templates/opStack'
import type { ProjectScalingStateValidation } from '../../types'
import { readMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('xlayer')
const bridge = discovery.getContract('AgglayerBridge')
const opgenesisTimestamp = UnixTime(1761304367)

const sequencerInbox = discovery.getContractValue<ChainSpecificAddress>(
  'SystemConfig',
  'sequencerInbox',
)

const inboxStartBlock =
  discovery.getContractValueOrUndefined<number>('SystemConfig', 'startBlock') ??
  0

const sequencer = discovery.getContractValue<ChainSpecificAddress>(
  'SystemConfig',
  'batcherHash',
)

const disputeGameFactory = discovery.getContract('DisputeGameFactory')
const opSuccinctFaultDisputeGame = discovery.getContract(
  'OPSuccinctFaultDisputeGame',
)
const sp1VerifierGateway = discovery.getContract('SP1VerifierGateway')

const maxChallengeDuration = discovery.getContractValue<number>(
  'OPSuccinctFaultDisputeGame',
  'maxChallengeDuration',
)
const maxProveDuration = discovery.getContractValue<number>(
  'OPSuccinctFaultDisputeGame',
  'maxProveDuration',
)
const disputeGameFinalityDelaySeconds = discovery.getContractValue<number>(
  'OptimismPortal2',
  'disputeGameFinalityDelaySeconds',
)
const proposerBond = discovery.getContractValue<number>(
  'DisputeGameFactory',
  'initBondGame42',
)
const challengerBond = discovery.getContractValue<number>(
  'OPSuccinctFaultDisputeGame',
  'challengerBond',
)
const fallbackTimeout = discovery.getContractValue<number>(
  'AccessManager',
  'FALLBACK_TIMEOUT',
)
const proposers = discovery.getContractValue<ChainSpecificAddress[]>(
  'AccessManager',
  'proposers',
)
const challengers = discovery.getContractValue<ChainSpecificAddress[]>(
  'AccessManager',
  'challengers',
)
const proposerSet = formatPermissionedSet(proposers.length, 'proposer')
const challengerSet = formatPermissionedSet(challengers.length, 'challenger')

const aggregationVkey = discovery.getContractValue<string>(
  'OPSuccinctFaultDisputeGame',
  'aggregationVkey',
)
const rangeVkeyCommitment = discovery.getContractValue<string>(
  'OPSuccinctFaultDisputeGame',
  'rangeVkeyCommitment',
)

const opSuccinctProgramHashes = [aggregationVkey, rangeVkeyCommitment].map(
  (hash) => PROGRAM_HASHES(hash),
)

const opSuccinctStateValidation = {
  categories: [
    {
      title: 'Fraud proofs',
      description: readMarkdown(
        'templates/opStack/opSuccinctLiteFraudProofs.md',
        {
          proposerBond: formatEther(proposerBond),
          maxChallengeDuration: formatSeconds(maxChallengeDuration),
          challengerBond: formatEther(challengerBond),
          maxProveDuration: formatSeconds(maxProveDuration),
        },
      ),
      references: [
        {
          title: 'OP Succinct Lite architecture',
          url: 'https://succinctlabs.github.io/op-succinct/fault_proofs/fault_proof_architecture.html',
        },
        {
          title: 'OPSuccinctFaultDisputeGame.sol - Etherscan source code',
          url: `https://etherscan.io/address/${ChainSpecificAddress.address(
            opSuccinctFaultDisputeGame.address,
          )}#code`,
        },
        {
          title: 'SP1VerifierGateway.sol - Etherscan source code',
          url: `https://etherscan.io/address/${ChainSpecificAddress.address(
            sp1VerifierGateway.address,
          )}#code`,
        },
      ],
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'the validity proof cryptography is broken or implemented incorrectly.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'no whitelisted challenger disputes an invalid state root before the challenge window expires.',
        },
        {
          category: 'Funds can be stolen if',
          text: 'the SP1 verifier gateway owner routes proof verification through a malicious or faulty verifier.',
        },
        {
          category: 'Funds can be frozen if',
          text: 'the permissioned proposer fails to publish state roots to L1.',
        },
      ],
    },
  ],
} satisfies ProjectScalingStateValidation

export const xlayer: ScalingProject = agglayer({
  addedAt: UnixTime(1713983341), // 2024-04-24T18:29:01Z
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  additionalBadges: [BADGES.Stack.OPSuccinct],
  display: {
    name: 'X Layer',
    slug: 'xlayer',
    architectureImage: 'xlayer',
    description:
      'X Layer is an OP Stack Layer 2 by OKX with seamless integration with OKX products. It is connected to the Agglayer shared bridge.',
    stacks: ['OP Stack', 'Agglayer CDK'],
    stateValidationImage: 'opsuccinct',
    links: {
      websites: ['https://okx.com/xlayer'],
      documentation: [
        'https://web3.okx.com/ua/xlayer/docs/developer/build-on-xlayer/about-xlayer',
      ],
      explorers: ['https://okx.com/explorer/xlayer'],
      socialMedia: ['https://twitter.com/XLayerOfficial'],
      bridges: ['https://web3.okx.com/xlayer/bridge'],
      repositories: ['https://github.com/okx/xlayer-erigon'],
    },
  },
  discovery,
  usesEthereumBlobs: true,
  associatedTokens: ['OKB'],
  nonTemplateProofSystem: {
    type: 'Optimistic',
    name: 'OP Succinct Lite',
    zkCatalogId: ProjectId('sp1hypercube'),
    challengeProtocol: 'Single-step',
  },
  nonTemplateRiskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_FP_1R_ZK,
      sentiment: 'bad',
      description:
        RISK_VIEW.STATE_FP_1R_ZK.description +
        ` Challenges are currently restricted to ${challengerSet} and proposals are restricted to ${proposerSet}.`,
      executionDelay: disputeGameFinalityDelaySeconds,
      challengeDelay: maxChallengeDuration,
      initialBond: {
        value: formatEther(proposerBond),
      },
      permissioned: true,
      defenderAdvantage: 'not-applicable',
    },
    proposerFailure: {
      value: 'Cannot withdraw',
      description: `Only whitelisted proposers can publish state roots. Permissionless proposing becomes available only after ${formatSeconds(
        fallbackTimeout,
      )} of proposer inactivity, which is not a practical recovery path.`,
      sentiment: 'bad',
    },
  },
  stateValidation: opSuccinctStateValidation,
  nonTemplateProgramHashes: opSuccinctProgramHashes,
  nonTemplateZkVerifiers: getSP1Verifiers(discovery),
  nonTemplateTechnology: {
    otherConsiderations: [
      {
        name: 'Agglayer shared bridge and OP Stack state validation',
        description:
          'X Layer uses OP Stack dispute games for state validation and withdrawal finalization. Separately, the Agglayer shared bridge uses pessimistic proofs to constrain cross-chain bridge accounting for assets in the shared bridge.',
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'the Agglayer pessimistic proof system for shared bridge accounting is implemented incorrectly.',
          },
          {
            category: 'Funds can be frozen if',
            text: 'the OP Succinct Lite proof system or verifier gateway cannot accept valid proofs during a challenge.',
          },
        ],
        references: [
          {
            title: 'Pessimistic Proof - Polygon Knowledge Layer',
            url: 'https://docs.polygon.technology/cdk/concepts/pessimistic-proofs',
          },
        ],
      },
    ],
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: bridge.address,
      tokens: '*',
      sinceTimestamp: UnixTime(1712620800),
      sharedEscrow: {
        type: 'AggLayer',
        nativeAsset: 'etherWrapped',
        wethAddress: EthereumAddress(
          '0x5a77f1443d16ee5761d310e38b62f77f726bc71c',
        ),
        tokensToAssignFromL1: ['OKB'],
      },
    }),
  ],
  nonTemplateTrackedTxs: [
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'transfer',
        from: EthereumAddress('0xdfd6C636Dcb5a013c2431316c4A0762B84e70a5d'),
        to: ChainSpecificAddress.address(sequencerInbox),
        sinceTimestamp: opgenesisTimestamp,
        untilTimestamp: 1766565023,
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'transfer',
        from: ChainSpecificAddress.address(sequencer),
        to: ChainSpecificAddress.address(sequencerInbox),
        sinceTimestamp: 1766565023,
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'functionCall',
        address: ChainSpecificAddress.address(disputeGameFactory.address),
        selector: '0x82ecf2f6',
        functionSignature:
          'function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)',
        sinceTimestamp: opgenesisTimestamp,
      },
    },
  ],
  nonTemplateDaTracking: [
    {
      type: 'ethereum',
      daLayer: ProjectId('ethereum'),
      sinceBlock: inboxStartBlock,
      untilBlock: 24081293,
      inbox: ChainSpecificAddress.address(sequencerInbox),
      sequencers: [
        EthereumAddress('0xdfd6C636Dcb5a013c2431316c4A0762B84e70a5d'),
      ],
    },
    {
      type: 'ethereum',
      daLayer: ProjectId('ethereum'),
      sinceBlock: 24081293,
      inbox: ChainSpecificAddress.address(sequencerInbox),
      sequencers: [ChainSpecificAddress.address(sequencer)],
    },
  ],
  chainConfig: {
    name: 'xlayer',
    chainId: 196,
    explorerUrl: 'https://rpc.xlayer.tech',
    gasTokens: ['OKB'],
    sinceTimestamp: UnixTime(1711782180),
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 47416,
        version: '3',
      },
    ],
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.xlayer.tech',
        callsPerMinute: 300,
      },
    ],
  },
  milestones: [
    {
      title: 'OP Succinct Lite dispute game activated',
      url: `https://etherscan.io/address/${ChainSpecificAddress.address(
        opSuccinctFaultDisputeGame.address,
      )}`,
      date: '2026-06-30',
      description:
        'X Layer activates OP Succinct Lite to resolve challenged OP Stack state proposals with ZK proofs.',
      type: 'general',
    },
    {
      title: 'Migration to Pessimistic Proofs',
      url: 'https://etherscan.io/tx/0xab579dbf426db0badfaef925504105088f3300b51f1362a4084c57d7e13c0fb1#eventlog',
      date: '2025-08-05',
      description:
        'X Layer stops validating the full L2 state and moves to bridge accounting proofs.',
      type: 'general',
    },
    {
      title: 'X Layer Public Launch',
      url: 'https://x.com/XLayerOfficial/status/1780056275898048562',
      date: '2024-04-16',
      description: 'X Layer is live on mainnet, integrated with Agglayer.',
      type: 'general',
    },
  ],
})

function formatPermissionedSet(count: number, role: string) {
  return `${count} whitelisted ${role}${count === 1 ? '' : 's'}`
}
