import {
  assert,
  ChainId,
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  FRONTRUNNING_RISK,
  RISK_VIEW,
  STATE_VALIDATION,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { PERFORMED_BY } from '../../common/performedBy'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import type { ProjectPermissionedAccount } from '../../types'

const discovery = new ProjectDiscovery('linea')

const timelockDelay = discovery.getContractValue<number>(
  'Timelock',
  'getMinDelay',
)
const timelockDelayString = formatSeconds(timelockDelay)

const zodiacRoles = discovery.getContractValue<{
  roles: Record<string, Record<string, boolean>>
}>('Roles', 'roles')
const zodiacPauserRole = '1'
const zodiacPausers: ProjectPermissionedAccount[] =
  discovery.formatPermissionedAccounts(
    Object.keys(zodiacRoles.roles[zodiacPauserRole].members),
  )
const zodiacPausersHardcoded = discovery.getPermissionedAccounts(
  'Roles',
  'pausers',
)

assert(
  zodiacPausers.length === zodiacPausersHardcoded.length &&
    zodiacPausers[0].address === zodiacPausersHardcoded[0].address,
  'disco config is wrong for the pausers, check hardcoded pausers in the Roles module',
)

const zodiacL2Roles = discovery.getContractValue<{
  roles: Record<string, Record<string, boolean>>
}>('L2Roles', 'roles')
const zodiacVoyageXpMinterRole = '1'
const zodiacVoyageXpMinters: ProjectPermissionedAccount[] =
  discovery.formatPermissionedAccounts(
    Object.keys(zodiacL2Roles.roles[zodiacVoyageXpMinterRole].members),
  )
const zodiacVoyageXpMintersHardcoded = discovery.getPermissionedAccounts(
  'L2Roles',
  'voyageXpMinters',
)
assert(
  zodiacVoyageXpMinters.length === zodiacVoyageXpMintersHardcoded.length &&
    zodiacVoyageXpMinters[0].address ===
      zodiacVoyageXpMintersHardcoded[0].address,
  'disco config is wrong for the voyageXpMinters, check hardcoded voyageXpMinters in the L2Roles module',
)

const zodiacL2PauserRole = '2'
const zodiacL2Pausers: ProjectPermissionedAccount[] =
  discovery.formatPermissionedAccounts(
    Object.keys(zodiacL2Roles.roles[zodiacL2PauserRole].members),
  )
const zodiacL2PausersHardcoded = discovery.getPermissionedAccounts(
  'L2Roles',
  'pausers',
)
assert(
  zodiacL2Pausers.length === zodiacL2PausersHardcoded.length &&
    zodiacL2Pausers[0].address === zodiacL2PausersHardcoded[0].address,
  'disco config is wrong for the L2 pausers, check hardcoded pausers in the L2Roles module',
)

const periodInSeconds = discovery.getContractValue<number>(
  'LineaRollup',
  'periodInSeconds',
)

const withdrawalLimitInWei = discovery.getContractValue<number>(
  'LineaRollup',
  'limitInWei',
)

const finalizationPeriod = 0 // state root immediately finalized when proven

const withdrawalLimitString = `Currently, there is a general limit of ${utils.formatEther(
  withdrawalLimitInWei,
)} ETH that can be withdrawn within each ${formatSeconds(
  periodInSeconds,
)} time window.`

const chainId = 59144

export const linea: ScalingProject = {
  type: 'layer2',
  id: ProjectId('linea'),
  capability: 'universal',
  addedAt: UnixTime(1679651674), // 2023-03-24T09:54:34Z
  display: {
    name: 'Linea',
    slug: 'linea',
    description:
      'Linea is a ZK Rollup powered by a zkEVM developed at Consensys, designed to scale the Ethereum network.',
    purposes: ['Universal'],
    links: {
      websites: ['https://linea.build/'],
      bridges: ['https://bridge.linea.build/'],
      documentation: ['https://docs.linea.build/'],
      explorers: [
        'https://lineascan.build/',
        'https://lineaplorer.build/',
        'https://explorer.linea.build/',
      ],
      repositories: [
        'https://github.com/Consensys?q=linea&type=all&language=&sort=stargazers',
      ],
      socialMedia: [
        'https://twitter.com/LineaBuild',
        'https://discord.gg/linea',
        'https://linea.mirror.xyz/',
        'https://community.linea.build/',
      ],
      rollupCodes: 'https://rollup.codes/linea',
    },
    liveness: {
      explanation:
        'Linea is a ZK rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted on L1. Proofs and state roots are currently posted in the same transaction.',
    },
  },
  proofSystem: {
    type: 'Validity',
    zkCatalogId: ProjectId('lineaprover'),
  },
  config: {
    associatedTokens: ['LINEA'],
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
        ),
        sinceTimestamp: UnixTime(1689159923),
        tokens: ['ETH'],
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319',
        ),
        sinceTimestamp: UnixTime(1691060675),
        excludedTokens: ['rsETH'],
        premintedTokens: ['LINEA'],
        tokens: '*',
      }),
    ],
    activityConfig: {
      type: 'block',
      startBlock: 1,
    },
    daTracking: [
      {
        type: 'ethereum',
        daLayer: ProjectId('ethereum'),
        sinceBlock: 0, // Edge Case: config added @ DA Module start
        inbox: EthereumAddress('0xd19d4b5d358258f05d7b411e21a1460d11b0876f'),
        sequencers: [
          EthereumAddress('0x46d2F319fd42165D4318F099E143dEA8124E9E3e'),
          EthereumAddress('0x52FF08F313A00A54e3Beffb5C4a7F7446eFb6754'),
        ],
      },
    ],
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
          ),
          selector: '0x7a776315',
          functionSignature:
            'function submitData((bytes32,bytes32,bytes32,uint256,uint256,bytes32,bytes))',
          sinceTimestamp: UnixTime(1707831168),
          untilTimestamp: UnixTime(1711469339),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
          ),
          selector: '0x2d3c12e5',
          functionSignature:
            'function submitBlobData(tuple(bytes32,bytes32,bytes32,uint256,uint256,bytes32),uint256,bytes,bytes)',
          // first tx with blobs
          // https://etherscan.io/tx/0x4d03b7e1950256de257ff95b52fac047faeb11600c5975abe7e0ccbc7be7ecfb
          sinceTimestamp: UnixTime(1711449407),
          untilTimestamp: UnixTime(1717588271),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
          ),
          selector: '0x42fbe842',
          functionSignature:
            'function submitBlobs(((bytes32,uint256,uint256,bytes32),uint256,bytes,bytes)[], bytes32, bytes32)',
          // first tx with blobs
          // https://etherscan.io/tx/0x88bca59bc9581b15b39379e5c68a6d0e4847eae04185c838f1c48c9b67abf87a
          sinceTimestamp: UnixTime(1717588271),
          untilTimestamp: UnixTime(1734357131),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
          ),
          selector: '0x6854f6bc',
          functionSignature:
            'function submitDataAsCalldata(tuple(bytes32 finalStateRootHash, bytes32 snarkHash, bytes compressedData) _submission, bytes32 _parentShnarf, bytes32 _expectedShnarf)',
          sinceTimestamp: UnixTime(1734357131),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'batchSubmissions' },
          { type: 'l2costs', subtype: 'batchSubmissions' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
          ),
          selector: '0x99467a35',
          functionSignature:
            'function submitBlobs(tuple(uint256 dataEvaluationClaim, bytes kzgCommitment, bytes kzgProof, bytes32 finalStateRootHash, bytes32 snarkHash)[] _blobSubmissions, bytes32 _parentShnarf, bytes32 _finalBlobShnarf)',
          // upgrade tx
          // https://etherscan.io/tx/0x96b88112de2e594cb763bc625cc2dcb6920825bb642eb1a62ff577f0c29f616d
          sinceTimestamp: UnixTime(1734357131),
        },
      },
      {
        uses: [
          {
            type: 'liveness',
            subtype: 'stateUpdates',
          },
          {
            type: 'l2costs',
            subtype: 'stateUpdates',
          },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
          ),
          selector: '0x4165d6dd',
          functionSignature:
            'function finalizeBlocks((bytes32, uint32, bytes[], bytes32[], bytes, uint16[])[] _blocksData,bytes _proof,uint256 _proofType,bytes32 _parentStateRootHash)',
          sinceTimestamp: UnixTime(1689159923),
          untilTimestamp: UnixTime(1707831168),
        },
      },
      {
        uses: [
          {
            type: 'liveness',
            subtype: 'stateUpdates',
          },
          {
            type: 'l2costs',
            subtype: 'stateUpdates',
          },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
          ),
          selector: '0xd630280f',
          functionSignature:
            'function finalizeCompressedBlocksWithProof(bytes,uint256,(bytes32,bytes32[],bytes32,uint256,uint256,uint256,bytes32,uint256,bytes32[],uint256,bytes))',
          sinceTimestamp: UnixTime(1707831168),
          untilTimestamp: UnixTime(1717508999),
        },
      },
      {
        uses: [
          {
            type: 'liveness',
            subtype: 'stateUpdates',
          },
          {
            type: 'l2costs',
            subtype: 'stateUpdates',
          },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
          ),
          selector: '0xabffac32',
          functionSignature:
            'function finalizeBlocksWithProof(bytes,uint256,(bytes32,bytes32,uint256,(bytes32,bytes32,bytes32,bytes32,bytes32),uint256,uint256,bytes32,bytes32,uint256,uint256,uint256,bytes32[],bytes))',
          sinceTimestamp: UnixTime(1717508999),
          untilTimestamp: UnixTime(1734357131),
        },
      },
      {
        uses: [
          {
            type: 'liveness',
            subtype: 'stateUpdates',
          },
          {
            type: 'l2costs',
            subtype: 'stateUpdates',
          },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
          ),
          selector: '0x5603c65f',
          functionSignature:
            'function finalizeBlocks(bytes _aggregatedProof, uint256 _proofType, tuple(bytes32 parentStateRootHash, uint256 endBlockNumber, tuple(bytes32 parentShnarf, bytes32 snarkHash, bytes32 finalStateRootHash, bytes32 dataEvaluationPoint, bytes32 dataEvaluationClaim) shnarfData, uint256 lastFinalizedTimestamp, uint256 finalTimestamp, bytes32 lastFinalizedL1RollingHash, bytes32 l1RollingHash, uint256 lastFinalizedL1RollingHashMessageNumber, uint256 l1RollingHashMessageNumber, uint256 l2MerkleTreesDepth, bytes32[] l2MerkleRoots, bytes l2MessagingBlocksOffsets) _finalizationData)',
          sinceTimestamp: UnixTime(1734357131),
        },
      },
    ],
    liveness: {
      duplicateData: {
        from: 'stateUpdates',
        to: 'proofSubmissions',
      },
    },
  },
  chainConfig: {
    name: 'linea',
    chainId,
    explorerUrl: 'https://lineascan.build',
    sinceTimestamp: UnixTime.fromDate(new Date('2023-07-19T14:00:00Z')),
    gasTokens: ['ETH'],
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 42,
        version: '3',
      },
    ],
    coingeckoPlatform: 'linea',
    apis: [
      { type: 'rpc', url: 'https://linea-mainnet.infura.io/v3' },
      { type: 'etherscan', chainId },
      { type: 'blockscoutV2', url: 'https://api-explorer.linea.build/api/v2' },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_BLOBS_OR_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.TRANSACTION_DATA_COMPRESSED,
  },
  riskView: {
    stateValidation: {
      // TODO: linea proof system is now complete
      ...RISK_VIEW.STATE_ZKP_SN,
      executionDelay: finalizationPeriod,
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      description:
        RISK_VIEW.DATA_ON_CHAIN.description +
        ' Unlike most ZK rollups, transaction data is posted instead of state diffs.',
    },
    exitWindow: RISK_VIEW.EXIT_WINDOW(timelockDelay, 0),
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_NO_MECHANISM(),
      description:
        RISK_VIEW.SEQUENCER_NO_MECHANISM().description +
        ' Eventually (after 6 months of no finalized blocks) the Operator role becomes public, theoretically allowing anyone to post data.',
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
      description:
        RISK_VIEW.PROPOSER_CANNOT_WITHDRAW.description +
        ' Eventually (after 6 months of no finalized blocks) the Operator role becomes public, theoretically allowing anyone to propose state with valid proofs.',
    },
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: null,
      },
      stage1: {
        principle: false,
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: false,
        securityCouncilProperlySetUp: {
          satisfied: false,
          message: 'Security Council members are not publicly known.',
          mode: 'replace',
        },
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/Consensys/linea-besu',
    },
  ),
  technology: {
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_BLOB_OR_CALLDATA,
      references: [
        {
          title:
            'LineaRollup.sol - Etherscan source code, submitBlobs() function',
          url: 'https://etherscan.io/address/0x07ddce60658A61dc1732Cacf2220FcE4A01C49B0#code',
        },
      ],
    },
    operator: {
      name: 'The system has a centralized sequencer',
      description:
        'Only a trusted sequencer is allowed to submit transaction batches. A mechanism for users to submit their own batches is currently disabled.',
      risks: [
        FRONTRUNNING_RISK,
        {
          category: 'Funds can be frozen if',
          text: 'the sequencer refuses to include an exit transaction.',
          isCritical: true,
        },
      ],
      references: [
        {
          title:
            'LineaRollup.sol - Etherscan source code, onlyRole(OPERATOR_ROLE) modifier',
          url: 'https://etherscan.io/address/0x07ddce60658A61dc1732Cacf2220FcE4A01C49B0#code',
        },
      ],
    },
    forceTransactions: FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
    exitMechanisms: [
      {
        ...EXITS.REGULAR_MESSAGING('zk'),
        description:
          EXITS.REGULAR_MESSAGING('zk').description +
          ' Note that withdrawal requests can be censored by the Sequencer. ' +
          withdrawalLimitString +
          ' Users can (eventually, after 6 months of inactivity from the centralized Operator) exit by replacing the Operator. In such a case they need to self-propose and prove their new state on the base layer with the required software which is currently not made available.',
        risks: [EXITS.OPERATOR_CENSORS_WITHDRAWAL],
        references: [
          {
            title:
              'L1MessageService.sol - Etherscan source code, claimMessageWithProof() function',
            url: 'https://etherscan.io/address/0x07ddce60658A61dc1732Cacf2220FcE4A01C49B0#code',
          },
          {
            title:
              'LineaRollup.sol - Etherscan source code, setFallbackOperator() function',
            url: 'https://etherscan.io/address/0x07ddce60658A61dc1732Cacf2220FcE4A01C49B0#code#F1#L212',
          },
        ],
      },
    ],
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK(timelockDelayString)],
  },
  stateDerivation: {
    nodeSoftware:
      'The node software ([Linea Besu](https://github.com/Consensys/linea-besu-package)) and a guide to reconstruct the state from L1 is available [here](https://docs.linea.build/get-started/how-to/state-recovery). Other node implementations like Nethermind, Geth or Erigon can sync too, but state derivation from L1 and Linea-specific features [are unsupported](https://docs.linea.build/get-started/how-to/run-a-node).',
    compressionScheme:
      'Linea uses a [bespoke lossless compression scheme](https://github.com/Consensys/linea-monorepo/blob/main/docs/architecture-description.md#blob-compressor) based on LZSS (deflate-like). It is available as a [dedicated library](https://github.com/Consensys/compress) and a [zk-decompression circuit](https://github.com/Consensys/gnark/tree/master/std/compress) in Gnark.',
    genesisState:
      'Is available via the official Linea docs for Linea Besu (preloaded), [Besu](https://docs.linea.build/get-started/how-to/run-a-node/besu#step-2-download-the-genesis-file-and-besu-configuration-file), [Erigon](https://docs.linea.build/get-started/how-to/run-a-node/erigon#step-2-download-the-genesis-file), [Nethermind](https://docs.linea.build/get-started/how-to/run-a-node/nethermind), [Geth](https://docs.linea.build/get-started/how-to/run-a-node/geth#step-2-download-the-genesis-file).',
    dataFormat:
      'Linea groups L2 blocks [into batches](https://lineascan.build/batches) which are then posted to L1 for proving. Each batch (whether sent as a blob or compressed calldata) contains L2 blocks. Blocks in turn include the [transactions with unnecessary data stripped](https://community.linea.build/t/proposal-state-reconstruction-from-l1-blobs/8038#p-22077-block-data-sent-to-l1-in-the-compressed-blob-2). More info on [the compression, packing and blob structure](https://github.com/Consensys/linea-monorepo/blob/main/docs/architecture-description.md#blob-compressor).',
  },
  stateValidation: {
    description:
      'Each update to the system state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Ethereum by a smart contract.',
    categories: [
      {
        title: 'Prover Architecture',
        description:
          'The Linea prover code is [available on Github](https://github.com/Consensys/linea-monorepo/tree/main/prover). Linea splits proving into: **Corset** (Go + Lisp DSL) expands EVM execution traces and generates a bespoke constraint system for the zk-EVM. **gnark** (Go) ingests the expanded traces and constraint system, instantiates the circuits and produces the SNARK proof.',
      },
      {
        title: 'ZK Circuits',
        description:
          'The constraint system lives in the public [linea-constraints](https://github.com/Consensys/linea-constraints) repo and is authored in a Lisp-style DSL before being compiled to Go. Gnark then turns those constraints into PLONK-compatible circuits over **BN254**. Internally, Linea’s flow uses a recursive proof stack called [Vortex → Arcane → PLONK compression](https://docs.linea.build/technology/transaction-lifecycle#step-5-generating-a-zk-proof-using-transaction-data): Vortex/Arcane supply small inner proofs that are finally aggregated into a single PLONK proof that the L1 contract can verify.',
      },
      {
        title: 'Verification Keys Generation',
        description:
          'Linea uses a Plonk-based proof system which requires a trusted setup. The verification keys are hardcoded in the verifier contract on-chain.',
      },
      {
        ...STATE_VALIDATION.VALIDITY_PROOFS,
        references: [
          {
            title:
              'LineaRollup.sol - Etherscan source code, finalizeBlocks() and _verifyProof() calls',
            url: 'https://etherscan.io/address/0x07ddce60658a61dc1732cacf2220fce4a01c49b0#code#F37#L41',
          },
          {
            title: 'PlonkVerifierMainnetFull.sol (Proof Type 0)',
            url: 'https://etherscan.io/address/0xA12E79C375FB0aaddfDA597BBe7b4e9A92e9b3De',
          },
          {
            title: 'PlonkVerifierMainnetFull.sol (Proof Type 1)',
            url: 'https://etherscan.io/address/0x8421D1e3fb9A737A85dC7FF531c39f324FB2aC5d',
          },
          {
            title: 'PlonkVerifierMainnetFull.sol (Proof Type 4)',
            url: 'https://etherscan.io/address/0x8CAE7ff138e401384df88a408314e4E9a92f274E',
          },
        ],
      },
    ],
    proofVerification: {
      shortDescription: 'Linea is a universal ZK-EVM rollup on Ethereum.',
      aggregation: false,
      requiredTools: [],
      verifiers: [
        {
          name: 'LineaVerifier (ProofType 4)',
          description:
            'The smart contract verifying the computational integrity of the Linea zkEVM. Since the circuit behind it is not public, we are not able to verify any claim about the proof system.',
          verified: 'failed',
          performedBy: PERFORMED_BY.l2beat,
          contractAddress: EthereumAddress(
            '0x41A4d93d09f4718fe899D12A4aD2C8a09104bdc7',
          ),
          chainId: ChainId.ETHEREUM,
          subVerifiers: [
            {
              name: 'Main circuit',
              proofSystem: '?',
              mainArithmetization: '?',
              mainPCS: '?',
            },
          ],
        },
        {
          name: 'LineaVerifier (ProofType 0)',
          description:
            'The smart contract verifying the computational integrity of the Linea zkEVM. Since the circuit behind it is not public, we are not able to verify any claim about the proof system.',
          verified: 'no',
          contractAddress: EthereumAddress(
            '0xED39C0C41A7651006953AB58Ecb3039363620995',
          ),
          chainId: ChainId.ETHEREUM,
          subVerifiers: [
            {
              name: 'Main circuit',
              proofSystem: '?',
              mainArithmetization: '?',
              mainPCS: '?',
            },
          ],
        },
      ],
    },
  },
  milestones: [
    {
      title: 'Linea halts for 1 hour',
      url: 'https://x.com/DeclanFox14/status/1965677827488903320',
      date: '2025-09-10T00:00:00Z',
      type: 'incident',
    },
    {
      title: 'Proof system is complete',
      url: 'https://x.com/LineaBuild/status/1932172959587913816',
      date: '2024-06-09T00:00:00Z',
      description:
        'The Linea proof system and verifier on ethereum covers 100% of the zkEVM.',
      type: 'general',
    },
    {
      title: 'Linea starts using blobs',
      url: 'https://twitter.com/LineaBuild/status/1772711269159567483',
      date: '2024-03-26T00:00:00Z',
      description: 'Linea starts publishing data to blobs.',
      type: 'general',
    },
    {
      title: 'Alpha v2 is released',
      date: '2024-02-13',
      description: 'This release reduces L1 costs and fees for users.',
      url: 'https://docs.linea.build/build-on-linea/linea-version#alpha-v2-release-notes',
      type: 'general',
    },
    {
      title: 'Open Testnet is Live',
      date: '2023-03-28',
      description:
        'Linea has launched on the Goerli testnet, allowing users and developers to test the platform.',
      url: 'https://linea.mirror.xyz/6G30hwV2wPs_wPv0VEgHYaIdghMkIQaad-OI_0br1hM',
      type: 'general',
    },
    {
      title: 'Mainnet Alpha Launch',
      date: '2023-07-12',
      description: 'Linea has launched on the Ethereum mainnet.',
      url: 'https://linea.mirror.xyz/7l9gKzYzKVOxEOnReavov467Ss_fsrkGzABvbRISPMY',
      type: 'general',
    },
  ],
  badges: [BADGES.VM.EVM, BADGES.DA.EthereumBlobs],
  discoveryInfo: getDiscoveryInfo([discovery]),
}
