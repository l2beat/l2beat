import {
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  ESCROW,
  OPERATOR,
  REASON_FOR_BEING_OTHER,
  RISK_VIEW,
} from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'
import { safeGetImplementation } from '../../templates/utils'
import type { ProjectScalingStateValidationCategory } from '../../types'

const discovery = new ProjectDiscovery('zircuit')

const ZIRCUIT_FINALIZATION_PERIOD_SECONDS: number =
  discovery.getContractValue<number>(
    'L2OutputOracle',
    'FINALIZATION_PERIOD_SECONDS',
  )

const withdrawalKeepalivePeriodSecondsFmt: number =
  discovery.getContractValue<number>(
    'L2OutputOracle',
    'withdrawalKeepalivePeriodSecondsFmt',
  )

const verifierV2 = discovery.getContract('VerifierV2')

// the opstack template automatically applies the correct risk rosette slices, so we do not override them
// as soon as this is not the case anymore (backdoor removed, permissionless proposing etc.),
// we should update the opstack.ts or not use it anymore
const ZIRCUIT_STATE_VALIDATION: ProjectScalingStateValidationCategory = {
  title: 'Validity proofs', // proof is the only input to the Verifier
  description: `Each update to the system state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Ethereum by a smart contract. Currently state updates do not require a proof if the last state update was made >= ${withdrawalKeepalivePeriodSecondsFmt} ago and is optimistically considered to be valid. Moreover, the system doesn't check that the transactions applied to the state are the ones published by the sequencer.`,
  risks: [
    {
      category: 'Funds can be stolen if',
      text: `the published state is invalid and the Challenger does not react during the ${formatSeconds(
        ZIRCUIT_FINALIZATION_PERIOD_SECONDS,
      )} finalization window.`,
    },
  ],
  references: [
    {
      title:
        'L2OutputOracle.sol - Etherscan source code - bootstrapV2() function',
      url: 'https://etherscan.io/address//0xeE646fEA9b1D7f89ae92266c5d7E799158416ca4#code#F1#L302',
    },
    {
      title: 'VerifierV2.sol - Etherscan source code',
      url: safeGetImplementation(verifierV2),
    },
  ],
}

const sequencerAddress = ChainSpecificAddress(
  discovery.getContractValue('SystemConfig', 'batcherHash'),
)
const sequencerInbox = discovery.getContractValue<ChainSpecificAddress>(
  'SystemConfig',
  'sequencerInbox',
)

const genesisTimestamp = UnixTime(1719936217)

export const zircuit: ScalingProject = opStackL2({
  addedAt: UnixTime(1712559704), // 2024-04-08T07:01:44Z
  discovery,
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Zircuit',
    slug: 'zircuit',
    description:
      'Zircuit is a universal ZK Rollup. It is based on the Optimism Bedrock architecture, employing AI to identify and stop malicious transactions at the sequencer level.',
    links: {
      websites: ['https://zircuit.com/'],
      bridges: ['https://bridge.zircuit.com/', 'https://app.zircuit.com/'],
      documentation: ['https://docs.zircuit.com/'],
      explorers: ['https://explorer.zircuit.com/'],
      repositories: ['https://github.com/zircuit-labs'],
      socialMedia: [
        'https://x.com/ZircuitL2',
        'https://discord.com/invite/zircuit',
        'https://zircuit.com/blog',
        'https://t.me/zircuitl2_bot',
      ],
    },
    architectureImage: 'zircuit',
  },
  genesisTimestamp,
  // Chain ID: 48900
  isNodeAvailable: 'UnderReview',
  stateValidation: {
    categories: [ZIRCUIT_STATE_VALIDATION],
  },
  activityConfig: {
    // zircuit does not have a system transaction in every block but in every 5th/6th, so we do not subtract those and overcount
    type: 'block',
    startBlock: 1,
  },
  chainConfig: {
    name: 'zircuit',
    chainId: 48900,
    coingeckoPlatform: 'zircuit',
    sinceTimestamp: UnixTime(1719936217),
    apis: [
      {
        type: 'rpc',
        url: 'https://zircuit1-mainnet.p2pify.com/',
        callsPerMinute: 1500,
      },
      {
        type: 'rpc',
        url: 'https://zircuit1-mainnet.liquify.com/',
        callsPerMinute: 1500,
      },
      {
        type: 'rpc',
        url: 'https://zircuit-mainnet.drpc.org/',
        callsPerMinute: 1500,
      },
      {
        type: 'sourcify',
        chainId: 48900,
      },
    ],
    explorerUrl: 'https://explorer.zircuit.com',
  },
  nonTemplateExcludedTokens: ['rswETH', 'rsETH'],
  l1StandardBridgePremintedTokens: ['ZRC'],
  associatedTokens: ['ZRC'],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x912C7271a6A3622dfb8B218eb46a6122aB046C79',
      ),
      tokens: ['wstETH'],
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'custom wstETH Vault controlled by Lido governance, using the canonical bridge for messaging.',
    }),
  ],
  nonTemplateRiskView: {
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_NO_MECHANISM(),
      description:
        RISK_VIEW.SEQUENCER_NO_MECHANISM().description +
        ' The L2 code has been modified to allow the sequencer to explicitly censor selected L1->L2 transactions.',
    },
  },
  nonTemplateTrackedTxs: [
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0x92Ef6Af472b39F1b363da45E35530c24619245A4'),
        selector: '0xa9efd6b8',
        functionSignature:
          'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1Blockhash, uint256 _l1BlockNumber, bytes _proof)',
        sinceTimestamp: UnixTime(1720137600),
        untilTimestamp: UnixTime(1741654919),
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
        sinceTimestamp: genesisTimestamp,
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
        { type: 'liveness', subtype: 'proofSubmissions' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0x92Ef6Af472b39F1b363da45E35530c24619245A4'),
        selector: '0x1bf75d29',
        functionSignature:
          'function proposeL2OutputV2(uint256 _batchIndex, bytes32 _batchHash, bytes32 _poseidonPostStateRoot, bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1BlockHash, uint256 _l1BlockNumber, bytes _aggrProof) payable',
        sinceTimestamp: UnixTime(1741654919),
      },
    },
  ],
  nonTemplateTechnology: {
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      description:
        OPERATOR.CENTRALIZED_OPERATOR.description +
        ' The L2 code has been modified to allow the sequencer to explicitly censor selected L1->L2 transactions.',
      references: [
        {
          title: 'L1Block.sol - Sourcify explorer source code',
          url: 'https://repo.sourcify.dev/48900/0xFf256497D61dcd71a9e9Ff43967C13fdE1F72D12',
        },
      ],
    },
  },
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://www.zircuit.com/blog/mainnet-phase-1-is-live',
      date: '2024-08-05T00:00:00.00Z',
      description: 'Zircuit is live on mainnet.',
      type: 'general',
    },
  ],
})
