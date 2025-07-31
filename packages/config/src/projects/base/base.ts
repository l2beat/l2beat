import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { DERIVATION, ESCROW } from '../../common'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('base')
const genesisTimestamp = UnixTime(1686074603)
const chainId = 8453

export const base: ScalingProject = opStackL2({
  addedAt: UnixTime(1689206400), // 2023-07-13T00:00:00Z
  discovery,
  genesisTimestamp,
  display: {
    name: 'Base Chain',
    slug: 'base',
    stateValidationImage: 'opfp',
    category: 'Optimistic Rollup',
    stacks: ['OP Stack'],
    description:
      'Base is an Optimistic Rollup built with the OP Stack. It offers a low-cost and builder-friendly way for anyone, anywhere, to build onchain.',
    links: {
      websites: ['https://base.org/'],
      bridges: ['https://bridge.base.org/'],
      documentation: ['https://docs.base.org/', 'https://stack.optimism.io/'],
      explorers: [
        'https://basescan.org/',
        'https://base.superscan.network',
        'https://base.blockscout.com/',
        'https://base.l2scan.co/',
      ],
      repositories: ['https://github.com/base-org'],
      socialMedia: [
        'https://twitter.com/BuildOnBase',
        'https://discord.gg/buildonbase',
        'https://base.mirror.xyz/',
        'https://warpcast.com/base',
      ],
      rollupCodes: 'https://rollup.codes/base',
    },
  },
  nonTemplateExcludedTokens: ['SolvBTC', 'SolvBTC.BBN', 'rsETH'], // TODO: check
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x9de443AdC5A411E83F1878Ef24C3F52C61571e72',
      ),
      tokens: ['wstETH'],
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'wstETH Vault for custom wstETH Gateway. Fully controlled by Lido governance.',
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x7F311a4D48377030bD810395f4CCfC03bdbe9Ef3',
      ),
      tokens: ['USDS', 'sUSDS'],
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'Maker/Sky-controlled vault for USDS and sUSDS bridged with canonical messaging.',
    }),
  ],
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOneSinceBlock', blockNumber: 1 },
  },
  nonTemplateDaTracking: [
    {
      type: 'ethereum',
      daLayer: ProjectId('ethereum'),
      sinceBlock: 0, // Edge Case: config added @ DA Module start
      inbox: ChainSpecificAddress.address(
        discovery.getContractValue('SystemConfig', 'sequencerInbox'),
      ),
      sequencers: [
        ChainSpecificAddress.address(
          discovery.getContractValue('SystemConfig', 'batcherHash'),
        ),
      ],
    },
  ],
  nonTemplateTrackedTxs: [
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'transfer',
        from: ChainSpecificAddress.address(
          discovery.getContractValue<ChainSpecificAddress>(
            'SystemConfig',
            'batcherHash',
          ),
        ),
        to: ChainSpecificAddress.address(
          discovery.getContractValue<ChainSpecificAddress>(
            'SystemConfig',
            'sequencerInbox',
          ),
        ),
        sinceTimestamp: genesisTimestamp,
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'functionCall',
        address: EthereumAddress('0x56315b90c40730925ec5485cf004d835058518A0'),
        selector: '0x9aaab648',
        functionSignature:
          'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1Blockhash, uint256 _l1BlockNumber)',
        sinceTimestamp: UnixTime(1686793895), // before proofs
        untilTimestamp: UnixTime(1730303471),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'functionCall',
        address: ChainSpecificAddress.address(
          discovery.getContract('DisputeGameFactory').address,
        ),
        selector: '0x82ecf2f6',
        functionSignature:
          'function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)',
        sinceTimestamp: UnixTime(1730303471), // after proofs
      },
    },
  ],
  isNodeAvailable: true,
  chainConfig: {
    name: 'base',
    chainId,
    explorerUrl: 'https://basescan.org',
    // ~ Timestamp of block number 0 on Base
    // https://basescan.org/block/0
    sinceTimestamp: UnixTime.fromDate(new Date('2023-06-15T12:35:47Z')),
    gasTokens: ['ETH'],
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 5022,
        version: '3',
      },
    ],
    coingeckoPlatform: 'base',
    apis: [
      {
        type: 'rpc',
        url: 'https://developer-access-mainnet.base.org',
        callsPerMinute: 1500,
      },
      { type: 'etherscan', chainId },
      { type: 'blockscoutV2', url: 'https://base.blockscout.com/api/v2' },
    ],
  },
  stateDerivation: DERIVATION.OPSTACK('BASE'),
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: true,
      },
      stage1: {
        principle: true,
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
      rollupNodeLink: 'https://github.com/base-org/node',
    },
  ),
  milestones: [
    {
      title: 'Base achieves Stage 1',
      url: 'https://base.mirror.xyz/tWDMlGp48fF0MeADcLQruUBq1Qxkou4O5x3ax8Rm3jA',
      date: '2025-04-29T00:00:00Z',
      description:
        'Through an upgrade in their governance process and a Security Council, Base is now stage 1.',
      type: 'general',
    },
    {
      title: 'Fault proofs!',
      url: 'https://base.mirror.xyz/eOsedW4tm8MU5OhdGK107A9wsn-aU7MAb8f3edgX5Tk',
      date: '2024-10-30T00:00:00Z',
      description: 'Base upgrades to OP stack fault proofs for state proving.',
      type: 'general',
    },
    {
      title: 'Chain stall',
      url: 'https://status.base.org/incidents/n3q0q4z24b7h',
      date: '2023-09-05T00:00:00Z',
      description:
        'Due to an RPC issue, the sequencer stops producing blocks for ~30 minutes.',
      type: 'incident',
    },
    {
      title: 'Base starts using blobs',
      url: 'https://twitter.com/Optimism/status/1768235284494450922',
      date: '2024-03-14T00:00:00Z',
      description: 'Base starts publishing data to blobs.',
      type: 'general',
    },
    {
      title: 'Mainnet Launch',
      url: 'https://base.mirror.xyz/hwNwqXHVoLlO8s4DZppog4DfGvM34tigaDjOWuEJQfY',
      date: '2023-07-13T00:00:00.00Z',
      description: 'Base is live on mainnet.',
      type: 'general',
    },
  ],
  upgradesAndGovernance:
    'All contracts are upgradable by a `ProxyAdmin` contract which is controlled by a nested 2/2 `Base Governance Multisig` composed by the `Base Coordinator Multisig` and the OP Foundation. The `Base Coordinator Multisig` is a 2/2 controlled by the Base Security Council multisig and the Base team multisig. The Guardian role is assigned to the Security Council multisig, with a Safe Module that limits the Optimism Foundation to act through it to stop withdrawals in the whole Superchain or specific individual chains. Each pause automatically expires after 3 months if not extended or unpaused by the Security Council. The Security Council can remove the module if the Foundation becomes malicious. The single Sequencer actor can be modified by the `Base Multisig 1` via the SystemConfig contract. The Base Governance multisig can also recover dispute bonds in case of bugs that would distribute them incorrectly.',
  nonTemplateContractRisks: {
    category: 'Funds can be stolen if',
    text: 'a contract receives a malicious code upgrade. Upgrades must be approved by 3 parties: Base Security Council, BaseMultisig2 and the OpFoundationOperationsSafe. There is no delay on upgrades.',
  },
  nonTemplateRiskView: {
    exitWindow: {
      value: 'None',
      description:
        'There is no window for users to exit in case of an unwanted regular upgrade since contracts are instantly upgradable. Upgrades need to be approved by 3 parties: Base multisig, the Op Foundation Operations multisig, and the Base Security Council.',
      sentiment: 'bad',
      orderHint: 0, // 0-7 days
    },
  },
})
