import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { DERIVATION, ESCROW, SOA } from '../../common'
import { BADGES } from '../../common/badges'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('optimism')
const l2Discovery = new ProjectDiscovery('optimism', 'optimism')
const genesisTimestamp = UnixTime(1636665399)
const chainId = 10

export const optimism: ScalingProject = opStackL2({
  addedAt: UnixTime(1629331200), // 2021-08-19T00:00:00Z
  additionalBadges: [BADGES.Other.Governance],
  discovery,
  genesisTimestamp,
  additionalDiscoveries: { ['optimism']: l2Discovery },
  display: {
    name: 'OP Mainnet',
    slug: 'op-mainnet',
    stateValidationImage: 'opfp',
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    description:
      'OP Mainnet is an EVM-equivalent Optimistic Rollup. It aims to be fast, simple, and secure.',
    links: {
      websites: ['https://optimism.io/'],
      apps: ['https://app.optimism.io'],
      documentation: ['https://community.optimism.io'],
      explorers: [
        'https://optimistic.etherscan.io',
        'https://optimism.blockscout.com/',
        'https://mainnet.superscan.network',
      ],
      repositories: ['https://github.com/ethereum-optimism/optimism'],
      socialMedia: [
        'https://x.com/Optimism',
        'https://optimism.mirror.xyz/',
        'https://twitter.com/OPLabsPBC',
        'https://youtube.com/playlist?list=PLX_rXoLYCf5HqTWygUfoMfzRirGz5lekH',
        'https://twitch.tv/optimismpbc',
        'https://discord.gg/optimism',
      ],
      rollupCodes: 'https://rollup.codes/optimism',
    },
  },
  hasSuperchainScUpgrades: true,
  associatedTokens: ['OP'],
  nonTemplateExcludedTokens: ['rsETH'],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65'),
      sinceTimestamp: UnixTime(1625675779),
      ...ESCROW.CANONICAL_EXTERNAL,
      tokens: ['DAI'],
      description: 'DAI Vault for custom DAI Gateway managed by MakerDAO.',
    }),
    discovery.getEscrowDetails({
      // current SNX bridge escrow
      address: EthereumAddress('0x5Fd79D46EBA7F351fe49BFF9E87cdeA6c821eF9f'),
      sinceTimestamp: UnixTime(1620680982),
      tokens: ['SNX'],
      ...ESCROW.CANONICAL_EXTERNAL,
      description: 'SNX Vault for custom SNX Gateway managed by Synthetix.',
    }),
    {
      // old snx bridge
      address: EthereumAddress('0x045e507925d2e05D114534D0810a1abD94aca8d6'),
      sinceTimestamp: UnixTime(1610668212),
      tokens: ['SNX'],
      ...ESCROW.CANONICAL_EXTERNAL,
      isHistorical: true,
      chain: 'ethereum',
    },
    {
      // also old snx bridge
      address: EthereumAddress('0xCd9D4988C0AE61887B075bA77f08cbFAd2b65068'),
      sinceTimestamp: UnixTime(1620680934),
      tokens: ['SNX'],
      ...ESCROW.CANONICAL_EXTERNAL,
      isHistorical: true,
      chain: 'ethereum',
    },
    discovery.getEscrowDetails({
      address: EthereumAddress('0x76943C0D61395d8F2edF9060e1533529cAe05dE6'),
      tokens: ['wstETH'],
      ...ESCROW.CANONICAL_EXTERNAL,
      description:
        'wstETH Vault for custom wstETH Gateway. Fully controlled by Lido governance.',
    }),
  ],
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOneSinceBlock', blockNumber: 105235064 },
  },
  nonTemplateDaTracking: [
    {
      type: 'ethereum',
      daLayer: ProjectId('ethereum'),
      sinceBlock: 0, // Edge Case: config added @ DA Module start
      inbox: '0xFF00000000000000000000000000000000000010',
      sequencers: ['0x6887246668a3b87f54deb3b94ba47a6f63f32985'],
    },
  ],
  finality: {
    type: 'OPStack',
    // timestamp of the first blob tx
    minTimestamp: UnixTime(1710375155),
    l2BlockTimeSeconds: 2,
    genesisTimestamp: UnixTime(1686068903),
    lag: 0,
    stateUpdate: 'disabled',
  },
  nonTemplateTrackedTxs: [
    {
      uses: [
        { type: 'liveness', subtype: 'batchSubmissions' },
        { type: 'l2costs', subtype: 'batchSubmissions' },
      ],
      query: {
        formula: 'transfer',
        from: discovery.getContractValue<EthereumAddress>(
          'SystemConfig',
          'batcherHash',
        ),
        to: discovery.getContractValue<EthereumAddress>(
          'SystemConfig',
          'sequencerInbox',
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
        address: EthereumAddress('0xdfe97868233d1aa22e815a266982f2cf17685a27'),
        selector: '0x9aaab648',
        functionSignature:
          'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1Blockhash, uint256 _l1BlockNumber)',
        sinceTimestamp: UnixTime(1660662182),
        untilTimestamp: UnixTime(1718039363),
      },
    },
    {
      uses: [
        { type: 'liveness', subtype: 'stateUpdates' },
        { type: 'l2costs', subtype: 'stateUpdates' },
      ],
      query: {
        formula: 'functionCall',
        address: discovery.getContract('DisputeGameFactory').address,
        selector: '0x82ecf2f6',
        functionSignature:
          'function create(uint32 _gameType, bytes32 _rootClaim, bytes _extraData) payable returns (address proxy_)',
        sinceTimestamp: UnixTime(1718039363), // first create() tx after upgrade https://etherscan.io/tx/0x720954e51b8d5a39475666a54b8087e4b11fcab184eab57e51f821ba14b4c014
      },
    },
  ],
  isNodeAvailable: true,
  chainConfig: {
    name: 'optimism',
    chainId,
    explorerUrl: 'https://optimistic.etherscan.io',
    // ~ Timestamp of block number 138 on Optimism
    // The first full hour timestamp that will return the block number
    // https://optimistic.etherscan.io/block/138
    sinceTimestamp: UnixTime.fromDate(new Date('2021-11-11T22:00:00Z')),
    gasTokens: ['ETH'],
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 4286263,
        version: '3',
      },
      {
        sinceBlock: 0,
        batchSize: 150,
        address: EthereumAddress('0xE295aD71242373C37C5FdA7B57F26f9eA1088AFe'),
        version: 'optimism',
      },
    ],
    coingeckoPlatform: 'optimistic-ethereum',
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet.optimism.io/',
        callsPerMinute: 1500,
      },
      { type: 'etherscan', chainId },
      { type: 'blockscoutV2', url: 'https://optimism.blockscout.com/api/v2' },
    ],
  },
  ecosystemInfo: {
    id: ProjectId('superchain'),
  },
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
  stateDerivation: {
    ...DERIVATION.OPSTACK('OP_MAINNET'),
    genesisState:
      'Since OP Mainnet has migrated from the OVM to Bedrock, a node must be synced using a data directory that can be found [here](https://docs.optimism.io/builders/node-operators/management/snapshots). To reproduce the migration itself, see this [guide](https://blog.oplabs.co/reproduce-bedrock-migration/).',
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
  upgradesAndGovernance:
    'All contracts are upgradable by the `SuperchainProxyAdmin` which is controlled by a 2/2 multisig composed by the Optimism Foundation and a Security Council. The Guardian role is assigned to the Security Council multisig, with a Safe Module that allows the Foundation to act through it to stop withdrawals in the whole Superchain, blacklist dispute games, or deactivate the fault proof system entirely in case of emergencies. The Security Council can remove the module if the Foundation becomes malicious. The single Sequencer actor can be modified by the `OpFoundationOperationsSafe` via the `SystemConfig` contract. The SuperchainProxyAdminOwner can recover dispute bonds in case of bugs that would distribute them incorrectly. \n\nAt the moment, for regular upgrades, the DAO signals its intent by voting on upgrade proposals, but has no direct control over the upgrade process.',
  milestones: [
    {
      title: 'Fallback to permissioned proposals for 26 days.',
      url: 'https://x.com/Optimism/status/1824560759747256596',
      date: '2024-08-16T00:00:00Z',
      description:
        'OP Mainnet preventively disables the fraud proof system due to a bug for 26 days.',
      type: 'incident',
    },
    {
      title: 'OP Mainnet becomes Stage 1',
      url: 'https://x.com/Optimism/status/1800256837088145799',
      date: '2024-06-10T00:00:00Z',
      description:
        'OP Mainnet introduces fraud proofs and updates permissions.',
      type: 'general',
    },
    {
      title: 'OP Mainnet starts using blobs',
      url: 'https://twitter.com/Optimism/status/1768235284494450922',
      date: '2024-03-14T00:00:00Z',
      description: 'OP Mainnet starts publishing data to blobs.',
      type: 'general',
    },
    {
      title: 'Network Upgrade #5: Ecotone',
      url: 'https://vote.optimism.io/proposals/95119698597711750186734377984697814101707190887694311194110013874163880701970',
      date: '2024-03-14T00:00:00Z',
      description: 'Optimism adopts EIP-4844.',
      type: 'general',
    },
    {
      title: 'Fault Proof System is live on OP Goerli',
      url: 'https://blog.oplabs.co/op-stack-fault-proof-alpha/',
      date: '2023-10-03T00:00:00Z',
      description: 'Fraud Proof system is live on Goerli.',
      type: 'general',
    },
    {
      title: 'Mainnet migration to Bedrock',
      url: 'https://oplabs.notion.site/Bedrock-Mission-Control-EXTERNAL-fca344b1f799447cb1bcf3aae62157c5',
      date: '2023-06-06T00:00:00Z',
      description: 'OP Mainnet, since Jun 2023 is running Bedrock.',
      type: 'general',
    },
    {
      title: 'OP Stack Introduced',
      url: 'https://optimism.mirror.xyz/fLk5UGjZDiXFuvQh6R_HscMQuuY9ABYNF7PI76-qJYs',
      date: '2022-10-17T00:00:00Z',
      description:
        'OP Stack, modular, open-sourced blueprint on how to build scalable blockchains.',
      type: 'general',
    },
    {
      title: 'Mainnet for everyone',
      description:
        'Whitelist got removed, there are no restrictions on who can transact with the network.',
      url: 'https://medium.com/ethereum-optimism/all-gas-no-brakes-8b0f32afd466',
      date: '2021-12-16T00:00:00Z',
      type: 'general',
    },
    {
      title: 'OP token airdrop',
      url: 'https://optimism.mirror.xyz/qvd0WfuLKnePm1Gxb9dpGchPf5uDz5NSMEFdgirDS4c',
      date: '2022-05-31T00:00:00Z',
      description: 'The first round of OP token airdrop.',
      type: 'general',
    },
    {
      title: 'Optimism removes OVM fraud proofs',
      url: 'https://twitter.com/optimismfnd/status/1458953238867165192?s=21&t=cQ0NPREYt-u1rP7OiPFKUg',
      date: '2021-11-12T00:00:00Z',
      description:
        'Network upgrade to OVM 2.0 and removal of fraud-proof system.',
      type: 'incident',
    },
    {
      title: 'Mainnet Soft Launch',
      url: 'https://medium.com/ethereum-optimism/mainnet-soft-launch-7cacc0143cd5',
      date: '2021-01-16T00:00:00Z',
      description:
        'Only selected contracts like Synthetix and Uniswap are available.',
      type: 'general',
    },
    {
      title: 'Community Launch',
      url: 'https://medium.com/ethereum-optimism/community-launch-7c9a2a9d3e84',
      date: '2021-08-19T00:00:00Z',
      description: 'All smart contracts allowed after prior approval.',
      type: 'general',
    },
  ],
})
