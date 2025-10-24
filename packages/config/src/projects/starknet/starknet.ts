import {
  ChainId,
  ChainSpecificAddress,
  EthereumAddress,
  formatLargeNumber,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  ESCROW,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
  STATE_VALIDATION,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { PROOFS } from '../../common/proofSystems'
import { getStage } from '../../common/stages/getStage'
import { ZK_PROGRAM_HASHES } from '../../common/zkProgramHashes'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { getSHARPVerifierUpgradeDelay } from '../../discovery/starkware'
import type { ScalingProject } from '../../internalTypes'
import {
  generateDiscoveryDrivenContracts,
  generateDiscoveryDrivenPermissions,
} from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('starknet')

const starknetDelaySeconds = discovery.getContractValue<number>(
  'Starknet',
  'StarkWareProxy_upgradeDelay',
)

const delayedExecutorDelaySeconds = discovery.getContractValue<number>(
  'DelayedExecutor',
  'executionDelay',
)

const ESCROW_ETH_ADDRESS = 'eth:0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419'
const ESCROW_WBTC_ADDRESS = 'eth:0x283751A21eafBFcD52297820D27C1f1963D9b5b4'
const ESCROW_USDC_ADDRESS = 'eth:0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816'
const ESCROW_USDT_ADDRESS = 'eth:0xbb3400F107804DFB482565FF1Ec8D8aE66747605'
const ESCROW_WSTETH_ADDRESS = 'eth:0xBf67F59D2988A46FBFF7ed79A621778a3Cd3985B'
const ESCROW_RETH_ADDRESS = 'eth:0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2'
const ESCROW_UNI_ADDRESS = 'eth:0xf76e6bF9e2df09D0f854F045A3B724074dA1236B'
const ESCROW_FRAX_ADDRESS = 'eth:0xDc687e1E0B85CB589b2da3C47c933De9Db3d1ebb'
const ESCROW_FXS_ADDRESS = 'eth:0x66ba83ba3D3AD296424a2258145d9910E9E40B7C'
const ESCROW_SFRXETH_ADDRESS = 'eth:0xd8E8531fdD446DF5298819d3Bc9189a5D8948Ee8'
const ESCROW_LUSD_ADDRESS = 'eth:0xF3F62F23dF9C1D2C7C63D9ea6B90E8d24c7E3DF5'
const ESCROW_LORDS_ADDRESS = 'eth:0x023A2aAc5d0fa69E3243994672822BA43E34E5C9'
const ESCROW_STRK_ADDRESS = 'eth:0xcE5485Cfb26914C5dcE00B9BAF0580364daFC7a4'
const ESCROW_MULTIBRIDGE_ADDRESS =
  'eth:0xF5b6Ee2CAEb6769659f6C091D209DfdCaF3F69Eb'
const ESCROW_SOLVBTC_ADDRESS = 'eth:0xA86b9b9c58d4f786F8ea89356c9c9Dde9432Ab10'
const ESCROW_LBTC_ADDRESS = 'eth:0x96C8AE2AC9A5cd5fC354e375dB4d0ca75fc0685e'

const escrowETHDelaySeconds = discovery.getContractValue<number>(
  ESCROW_ETH_ADDRESS,
  'StarkWareProxy_upgradeDelay',
)
const escrowSTRKDelaySeconds = discovery.getContractValue<number>(
  ESCROW_STRK_ADDRESS,
  'StarkWareProxy_upgradeDelay',
)

const minDelay = Math.min(
  starknetDelaySeconds,
  getSHARPVerifierUpgradeDelay(),
  escrowETHDelaySeconds,
  escrowSTRKDelaySeconds,
)

const minNonScDelay = Math.min(
  delayedExecutorDelaySeconds,
  getSHARPVerifierUpgradeDelay(),
)

function formatMaxTotalBalanceString(
  ticker: string,
  maxTotalBalance: number,
  decimals: number,
) {
  if (
    maxTotalBalance.toString() ===
    '115792089237316195423570985008687907853269984665640564039457584007913129639935'
  ) {
    return 'There is no bridge cap.'
  }
  return `The current bridge cap is ${formatLargeNumber(
    maxTotalBalance / 10 ** decimals,
  )} ${ticker}.`
}

const escrowETHMaxTotalBalanceString = formatMaxTotalBalanceString(
  'ETH',
  discovery.getContractValue<number>('ETHBridge', 'maxTotalBalance'),
  18,
)

const escrowWBTCMaxTotalBalanceString = formatMaxTotalBalanceString(
  'WBTC',
  discovery.getContractValue<number>('WBTCBridge', 'maxTotalBalance'),
  8,
)

const escrowUSDCMaxTotalBalanceString = formatMaxTotalBalanceString(
  'USDC',
  discovery.getContractValue<number>('USDCBridge', 'maxTotalBalance'),
  6,
)

const escrowUSDTMaxTotalBalanceString = formatMaxTotalBalanceString(
  'USDT',
  discovery.getContractValue<number>('USDTBridge', 'maxTotalBalance'),
  6,
)

const escrowWSTETHMaxTotalBalanceString = formatMaxTotalBalanceString(
  'wstETH',
  discovery.getContractValue<number>('wstETHBridge', 'maxTotalBalance'),
  18,
)

const escrowRETHMaxTotalBalanceString = formatMaxTotalBalanceString(
  'rETH',
  discovery.getContractValue<number>('rETHBridge', 'maxTotalBalance'),
  18,
)

const escrowUNIMaxTotalBalanceString = formatMaxTotalBalanceString(
  'UNI',
  discovery.getContractValue<number>('UNIBridge', 'maxTotalBalance'),
  18,
)

const escrowFRAXMaxTotalBalanceString = formatMaxTotalBalanceString(
  'FRAX.legacy',
  discovery.getContractValue<number>('FRAXBridge', 'maxTotalBalance'),
  18,
)

const escrowFXSMaxTotalBalanceString = formatMaxTotalBalanceString(
  'FRAX',
  discovery.getContractValue<number>('FXSBridge', 'maxTotalBalance'),
  18,
)

const escrowSFRXETHMaxTotalBalanceString = formatMaxTotalBalanceString(
  'sfrxETH',
  discovery.getContractValue<number>('sfrxETHBridge', 'maxTotalBalance'),
  18,
)

const escrowLUSDMaxTotalBalanceString = formatMaxTotalBalanceString(
  'LUSD',
  discovery.getContractValue<number>('LUSDBridge', 'maxTotalBalance'),
  18,
)

const escrowDAIMaxTotalBalanceString = formatMaxTotalBalanceString(
  'DAI',
  discovery.getContractValue<number>('L1DaiGateway', 'ceiling'),
  18,
)
const escrowSTRKMaxTotalBalanceString = formatMaxTotalBalanceString(
  'DAI',
  discovery.getContractValue<number>('STRKBridge', 'maxTotalBalance'),
  18,
)

const finalizationPeriod = 0

const scThreshold = discovery.getMultisigStats('Starkware Security Council')
const sharpMsThreshold = discovery.getMultisigStats('SHARP Multisig')

const starknetProgramHashes = []
starknetProgramHashes.push(
  discovery.getContractValue<string>('Starknet', 'programHash'),
)
starknetProgramHashes.push(
  discovery.getContractValue<string>('Starknet', 'aggregatorProgramHash'),
)

export const starknet: ScalingProject = {
  type: 'layer2',
  id: ProjectId('starknet'),
  capability: 'universal',
  addedAt: UnixTime(1642687633), // 2022-01-20T14:07:13Z
  badges: [
    BADGES.VM.CairoVM,
    BADGES.DA.EthereumBlobs,
    BADGES.Stack.SNStack,
    BADGES.Infra.SHARP,
    BADGES.Other.Governance,
  ],
  display: {
    name: 'Starknet',
    slug: 'starknet',
    stacks: ['SN Stack'],
    description:
      'Starknet is a ZK rollup that uses STARK proofs to securely scale Ethereum and Ethereum blobs for data availability. Starknet is also actively engaged in bringing Bitcoin users the same scale, UX, and liquidity through a variety of products and programs.',
    purposes: ['Universal'],
    links: {
      bridges: ['https://starkgate.starknet.io/'],
      websites: [
        'https://starknet.io/',
        'https://starkware.co/starknet/',
        'https://starkware.co/ecosystem/',
        'https://community.starknet.io/',
      ],
      documentation: ['https://docs.starknet.io'],
      explorers: ['https://voyager.online/', 'https://starkscan.co/'],
      repositories: ['https://github.com/starkware-libs'],
      socialMedia: [
        'https://discord.com/invite/qypnmzkhbc',
        'https://twitter.com/StarkWareLtd',
        'https://medium.com/starkware',
        'https://starkware.co/',
        'https://youtube.com/channel/UCnDWguR8mE2oDBsjhQkgbvg',
      ],
    },
    liveness: {
      explanation:
        'Starknet is a ZK rollup that posts state diffs to the L1. For a transaction to be considered final, the state diffs have to be submitted and a validity proof should be generated, submitted, and verified. Proofs are aggregated with other projects using SHARP and state updates have to refer to proved claims.',
    },
    costsWarning: {
      sentiment: 'warning',
      value:
        "The proof verification costs are shared among all projects that use the Starkware SHARP verifier. Due to this complexity, Starknet's SHARP costs represent an estimate based on self-reported costs by the Starkware team.",
    },
  },
  proofSystem: {
    type: 'Validity',
    zkCatalogId: ProjectId('stone'),
  },
  chainConfig: {
    name: 'starknet',
    chainId: undefined,
    gasTokens: ['ETH', 'STRK'],
    sinceTimestamp: UnixTime(1637069048), // block 0
    apis: [
      {
        type: 'starknet',
        url: 'https://starknet-rpc.publicnode.com',
        callsPerMinute: 120,
      },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_BLOBS_OR_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.STATE_DIFFS_COMPRESSED,
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_ST,
      executionDelay: finalizationPeriod,
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN_STATE_DIFFS,
    },
    exitWindow: RISK_VIEW.EXIT_WINDOW_STARKNET(minNonScDelay),
    sequencerFailure: RISK_VIEW.SEQUENCER_CAN_SKIP('L1'),
    proposerFailure: RISK_VIEW.PROPOSER_WHITELIST_SECURITY_COUNCIL(),
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
        principle: true,
        usersHave7DaysToExit: true,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: true,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: false,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/eqlabs/pathfinder',
      securityCouncilReference:
        'https://governance.starknet.io/learn/security_council',
      stage1PrincipleDescription:
        'While Starknet is considered Stage 1, the Security Council minority is employed to enforce censorship resistance in case the permissioned operator fails to include transactions. The process through which a censored user can contact the Security Council is not defined and currently unclear.',
    },
  ),
  technology: {
    dataAvailability: TECHNOLOGY_DATA_AVAILABILITY.STARKNET_ON_CHAIN(true),
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      description:
        OPERATOR.CENTRALIZED_OPERATOR.description +
        ' Typically, the Operator is the hot wallet of the Starknet service submitting state updates for which proofs have been already submitted and verified.',
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
      references: [
        {
          title: 'Censorship resistance of Starknet - Forum Discussion',
          url: 'https://community.starknet.io/t/censorship-resistance/196',
        },
      ],
    },
    exitMechanisms: EXITS.STARKNET,
  },
  stateDerivation: {
    nodeSoftware:
      'The [Juno](https://github.com/NethermindEth/juno) node software can be used to reconstruct the L2 state entirely from L1. The feature has not been released yet, but can be found in this [PR](https://github.com/NethermindEth/juno/pull/1335).',
    compressionScheme:
      'Starknet uses [stateful compression since v0.13.4](https://docs.starknet.io/architecture/data-availability/#v0_13_4).',
    genesisState: 'There is no non-empty genesis state.',
    dataFormat:
      'The data format has been updated with different versions, and the full specification can be found [here](https://docs.starknet.io/architecture/data-availability/).',
  },
  stateValidation: {
    description:
      'Each update to the system state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Ethereum by a smart contract.',
    categories: [
      {
        title: 'Proven Program',
        description:
          'The source code of the Starknet OS can be found [here](https://github.com/starkware-libs/cairo-lang/tree/master/src/starkware/starknet/core/os). The source code of the bootloader can be found [here](https://github.com/starkware-libs/cairo-lang/blob/master/src/starkware/cairo/bootloaders/bootloader/bootloader.cairo).',
        risks: [],
      },
      {
        ...STATE_VALIDATION.VALIDITY_PROOFS,
        references: [
          {
            title: 'What is Starknet',
            url: 'https://starkware.co/starknet/',
          },
        ],
      },
    ],
    proofVerification: {
      shortDescription: 'Starknet is a ZK-CairoVM rollup on Ethereum.',
      aggregation: true,
      requiredTools: [],
      verifiers: [
        {
          name: 'SHARPVerifier',
          description:
            'Starknet utilizes STARKs for their system. The protocol makes use of recursive aggregation across multiple projects that share the same onchain verifier. SHARP stands for SHARed Prover. Different programs are represented onchain with different program hashes.',
          verified: 'no',
          contractAddress: EthereumAddress(
            '0x9fb7F48dCB26b7bFA4e580b2dEFf637B13751942',
          ),
          chainId: ChainId.ETHEREUM,
          subVerifiers: [
            // TODO: change links when this is released: https://github.com/starkware-libs/cairo-lang/commit/0e4dab8a6065d80d1c726394f5d9d23cb451706a
            {
              name: 'Main bootloader',
              ...PROOFS.PROGRAM,
              link: 'https://github.com/starkware-libs/cairo-lang/blob/v0.13.1/src/starkware/cairo/bootloaders/bootloader/bootloader.cairo',
            },
            {
              name: 'Simple bootloader',
              ...PROOFS.PROGRAM,
              link: 'https://github.com/starkware-libs/cairo-lang/blob/v0.13.1/src/starkware/cairo/bootloaders/simple_bootloader/simple_bootloader.cairo',
            },
            {
              name: 'Applicative bootloader',
              ...PROOFS.PROGRAM,
              link: 'https://github.com/starkware-libs/cairo-lang/blob/v0.13.2a0/src/starkware/cairo/bootloaders/applicative_bootloader/applicative_bootloader.cairo',
            },
            {
              name: 'Recursive Cairo verifier',
              proofSystem: 'STARK',
              mainArithmetization: 'AIR',
              mainPCS: 'FRI',
              trustedSetup: 'None',
              link: 'https://github.com/starkware-libs/cairo-lang/tree/v0.13.1/src/starkware/cairo/cairo_verifier/layouts/all_cairo',
            },
            {
              name: 'StarknetOS',
              ...PROOFS.PROGRAM,
              link: 'https://github.com/starkware-libs/cairo-lang/tree/v0.13.1/src/starkware/starknet/core/os',
            },
          ],
        },
      ],
    },
  },
  permissions: generateDiscoveryDrivenPermissions([discovery]),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_SECONDS_RISK(minDelay)],
    zkProgramHashes: starknetProgramHashes.map((el) => ZK_PROGRAM_HASHES(el)),
  },
  upgradesAndGovernance: `
The Starknet zk Rollup shares its SHARP verifier with other StarkEx and SN Stack Layer 2s. Governance of the main Starknet rollup contract and its core bridge escrows (ETHBridge, STRKBridge) is currently split between the ${scThreshold} Security Council with instant upgrade capability and the ${discovery.getMultisigStats('Starkware Multisig 2')} Starkware Multisig 2 who can upgrade with a ${discovery.getContractValue('DelayedExecutor', 'executionDelayFmt')} delay. The former Multisig also governs most other bridge escrows with instant upgradeability. The shared SHARP verifier used for state validation can be changed by the ${sharpMsThreshold} SHARP Multisig with and a ${discovery.getContractValue('SHARPVerifierCallProxy', 'upgradeActivationDelayFmt')} delay, affecting all rollups like Starknet that are sharing it. 

The Operator role in the Starknet contract is permissioned to update the state of the Starknet rollup by supplying valid (zk) state transition proofs. Since this role is not permissionless, Starknet implements a StarknetSCMinorityMultisig with the Operator role, which allows a ${discovery.getMultisigStats('Starkware SCMinority Multisig')} minority of the StarknetSecurityCouncil to enforce censorship resistance by including transactions that are not included by regular Operators.

All bridge escrows allow enabling a withdrawal throttle of 5% of the locked funds per 24h period. Enabling it is permissioned to a Multisig while disabling it in the core bridge escrows (STRKBridge, ETHBridge) can be done by a ${discovery.getMultisigStats('Starkware SCMinority Multisig')} minority of the Security Council.
`,
  milestones: [
    {
      title: 'Starknet is down for several hours',
      url: 'https://x.com/Starknet/status/1962740091937317247',
      date: '2025-09-02T00:00:00.00Z',
      description:
        'Starknet experiences a reorg caused by a bug on the sequencing side.',
      type: 'incident',
    },
    {
      title: 'Grinta upgrade is deployed',
      url: 'https://x.com/Starknet/status/1962457868277305357',
      date: '2025-09-02T00:00:00.00Z',
      description:
        'Starknet activates the grinta upgrade with several improvements.',
      type: 'general',
    },
    {
      title: 'Stage 1',
      url: 'https://x.com/Starknet/status/1922990242035814424',
      date: '2025-05-15T00:00:00.00Z',
      description:
        'Starknet is now Stage 1 by introducing a Security Council, upgrade delays and censorship resistance.',
      type: 'general',
    },
    {
      title: 'Starknet 4h outage',
      url: 'https://cointelegraph.com/news/starknet-details-bug-reorganization-blockss',
      date: '2024-04-04T00:00:00Z',
      description: 'A rounding error causes a 4-hour outage on Starknet.',
      type: 'incident',
    },
    {
      title: 'Starknet starts using blobs',
      url: 'https://twitter.com/Starknet/status/1767915153700290839',
      date: '2024-03-13T00:00:00Z',
      description: 'Starknet starts publishing data to blobs.',
      type: 'general',
    },
    {
      title: 'Starknet Provisions',
      url: 'https://www.starknet.io/en/content/starknet-provisions-program',
      date: '2024-02-14T00:00:00Z',
      description:
        'Starknet begins allocating $STRK to early contributors and users.',
      type: 'general',
    },
    {
      title: 'Starknet Alpha',
      url: 'https://medium.com/starkware/starknet-alpha-now-on-mainnet-4cf35efd1669',
      date: '2021-11-29T00:00:00Z',
      description:
        'Rollup is live on mainnet, enabling general computation using ZK Rollup technology.',
      type: 'general',
    },
    {
      title: 'StarkGate Alpha',
      url: 'https://medium.com/starkware/starkgate-alpha-35d01d21e3af',
      date: '2022-05-09T00:00:00Z',
      description:
        'Bridge is live on mainnet, serving as gateway between Ethereum and Starknet.',
      type: 'general',
    },
  ],
  config: {
    associatedTokens: ['STRK'],
    escrows: [
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(ESCROW_ETH_ADDRESS),
        sinceTimestamp: UnixTime(1647857148),
        tokens: ['ETH'],
        description:
          'StarkGate bridge for ETH.' + ' ' + escrowETHMaxTotalBalanceString,
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(
          'eth:0x0437465dfb5B79726e35F08559B0cBea55bb585C',
        ),
        sinceTimestamp: UnixTime(1652101033),
        tokens: ['DAI'],
        ...ESCROW.CANONICAL_EXTERNAL,
        description:
          'DAI Vault for custom DAI Gateway managed by MakerDAO.' +
          ' ' +
          escrowDAIMaxTotalBalanceString,
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(ESCROW_WBTC_ADDRESS),
        sinceTimestamp: UnixTime(1657137600),
        tokens: ['WBTC'],
        description:
          'StarkGate bridge for WBTC.' + ' ' + escrowWBTCMaxTotalBalanceString,
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(ESCROW_USDC_ADDRESS),
        sinceTimestamp: UnixTime(1657137639),
        tokens: ['USDC'],
        description:
          'StarkGate bridge for USDC.' + ' ' + escrowUSDCMaxTotalBalanceString,
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(ESCROW_USDT_ADDRESS),
        sinceTimestamp: UnixTime(1657137615),
        tokens: ['USDT'],
        description:
          'StarkGate bridge for USDT.' + ' ' + escrowUSDTMaxTotalBalanceString,
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(ESCROW_WSTETH_ADDRESS),
        sinceTimestamp: UnixTime(1657137623),
        tokens: ['wstETH'],
        description:
          'StarkGate bridge for wstETH.' +
          ' ' +
          escrowWSTETHMaxTotalBalanceString,
        ...ESCROW.CANONICAL_EXTERNAL,
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(ESCROW_RETH_ADDRESS),
        sinceTimestamp: UnixTime(1657137623),
        tokens: ['rETH'],
        description:
          'StarkGate bridge for rETH.' + ' ' + escrowRETHMaxTotalBalanceString,
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(ESCROW_UNI_ADDRESS),
        tokens: ['UNI'],
        description:
          'StarkGate bridge for UNI.' + ' ' + escrowUNIMaxTotalBalanceString,
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(ESCROW_FRAX_ADDRESS),
        tokens: ['FRAX.legacy'],
        description:
          'StarkGate bridge for FRAX.' + ' ' + escrowFRAXMaxTotalBalanceString,
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(ESCROW_FXS_ADDRESS),
        tokens: ['FRAX'],
        description:
          'StarkGate bridge for FXS.' + ' ' + escrowFXSMaxTotalBalanceString,
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(ESCROW_SFRXETH_ADDRESS),
        tokens: ['sfrxETH'],
        description:
          'StarkGate bridge for sfrxETH.' +
          ' ' +
          escrowSFRXETHMaxTotalBalanceString,
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(ESCROW_LUSD_ADDRESS),
        tokens: ['LUSD'],
        description:
          'StarkGate bridge for LUSD.' + ' ' + escrowLUSDMaxTotalBalanceString,
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(ESCROW_LORDS_ADDRESS),
        tokens: ['LORDS'],
        description: 'StarkGate bridge for LORDS.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(ESCROW_STRK_ADDRESS),
        tokens: ['STRK'],
        description:
          'StarkGate bridge for STRK.' + ' ' + escrowSTRKMaxTotalBalanceString,
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(ESCROW_MULTIBRIDGE_ADDRESS),
        tokens: ['EKUBO', 'ZEND', 'NSTR'],
        description:
          'StarkGate bridge for EKUBO, ZEND, NSTR (and potentially other tokens listed via StarkgateManager).',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(ESCROW_SOLVBTC_ADDRESS),
        tokens: ['SolvBTC'],
        description: 'StarkGate bridge for SolvBTC.',
      }),
      discovery.getEscrowDetails({
        address: ChainSpecificAddress(ESCROW_LBTC_ADDRESS),
        tokens: ['LBTC'],
        description: 'StarkGate bridge for LBTC.',
      }),
    ],
    activityConfig: {
      type: 'day',
      sinceTimestamp: UnixTime(1637020800),
      dataSource: 'Voyager API',
    },
    daTracking: [
      {
        type: 'ethereum',
        daLayer: ProjectId('ethereum'),
        sinceBlock: 0, // Edge Case: config added @ DA Module start
        inbox: EthereumAddress('0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4'),
        sequencers: [
          EthereumAddress('0xFf6B2185E357b6e9136A1b2ca5d7C45765D5c591'),
          EthereumAddress('0x2C169DFe5fBbA12957Bdd0Ba47d9CEDbFE260CA7'),
        ],
      },
    ],
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'proofSubmissions' },
          { type: 'l2costs', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: UnixTime(1636978914),
          untilTimestamp: UnixTime(1702921247),
          programHashes: [
            '1865367024509426979036104162713508294334262484507712987283009063059134893433',
          ],
        },
        _hackCostMultiplier: 0.7,
      },
      {
        uses: [
          { type: 'liveness', subtype: 'proofSubmissions' },
          { type: 'l2costs', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: UnixTime(1702921247),
          untilTimestamp: UnixTime(1704855731),
          programHashes: [
            '54878256403880350656938046611252303365750679698042371543935159963667935317',
          ],
        },
        _hackCostMultiplier: 0.7,
      },
      {
        uses: [
          { type: 'liveness', subtype: 'proofSubmissions' },
          { type: 'l2costs', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: UnixTime(1704855731),
          untilTimestamp: UnixTime(1710252995),
          programHashes: [
            '2479841346739966073527450029179698923866252973805981504232089731754042431018',
          ],
        },
        _hackCostMultiplier: 0.7,
      },
      {
        uses: [
          { type: 'liveness', subtype: 'proofSubmissions' },
          { type: 'l2costs', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: UnixTime(1710252995),
          untilTimestamp: UnixTime(1710625271),
          programHashes: [
            '109586309220455887239200613090920758778188956576212125550190099009305121410',
          ],
        },
        _hackCostMultiplier: 0.65,
      },
      {
        uses: [
          { type: 'liveness', subtype: 'proofSubmissions' },
          { type: 'l2costs', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: UnixTime(1710625271),
          untilTimestamp: UnixTime(1715783986), // 15.05.2024 https://app.blocksec.com/explorer/tx/eth/0x3b5c41b3abb8e265b8d58ec3dde79790d4f0ee050de97f8bd0fe68048c070bdd
          programHashes: [
            '3383082961563516565935611087683915026448707331436034043529592588079494402084',
          ],
        },
        _hackCostMultiplier: 0.65,
      },
      {
        uses: [
          { type: 'liveness', subtype: 'proofSubmissions' },
          { type: 'l2costs', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: UnixTime(1715783986),
          untilTimestamp: UnixTime(1724856227),
          programHashes: [
            '3383082961563516565935611087683915026448707331436034043529592588079494402084',
          ],
        },
        _hackCostMultiplier: 0.2,
      },
      {
        uses: [
          { type: 'liveness', subtype: 'proofSubmissions' },
          { type: 'l2costs', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: UnixTime(1724856227),
          untilTimestamp: UnixTime(1732747391),
          programHashes: [
            '853638403225561750106379562222782223909906501242604214771127703946595519856', // Starknet OS
          ],
        },
        _hackCostMultiplier: 0.2,
      },
      {
        uses: [
          { type: 'liveness', subtype: 'proofSubmissions' },
          { type: 'l2costs', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: UnixTime(1724856227),
          untilTimestamp: UnixTime(1732747391),
          programHashes: [
            '1161178844461337253856226043908368523817098764221830529880464854589141231910', // old Aggregator
          ],
        },
        _hackCostMultiplier: 0.2,
      },
      {
        uses: [
          { type: 'liveness', subtype: 'proofSubmissions' },
          { type: 'l2costs', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: UnixTime(1732747391),
          untilTimestamp: UnixTime(1742836319), // 2025/03/24 17:11 UTC
          programHashes: [
            '2397984267054479079853548842566103781972463965746662494980785692480538410509', // Starknet OS
          ],
        },
        _hackCostMultiplier: 0.05,
      },
      {
        uses: [
          { type: 'liveness', subtype: 'proofSubmissions' },
          { type: 'l2costs', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: UnixTime(1742836319),
          untilTimestamp: UnixTime(1742967335), // 2025/03/26 05:35 UTC
          programHashes: [
            '2231644845387633655859130162745748394456578773184260372693322394988769337368', // Starknet OS
          ],
        },
        _hackCostMultiplier: 0.17,
      },
      {
        uses: [
          { type: 'liveness', subtype: 'proofSubmissions' },
          { type: 'l2costs', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: UnixTime(1742967335),
          untilTimestamp: UnixTime(1756730495), // Sep-01-2025 02:41:35 PM UTC
          programHashes: [
            '2534935718742676028234156221136000178296467523045214874259117268197132196876', // Starknet OS
          ],
        },
        _hackCostMultiplier: 0.17,
      },
      {
        uses: [
          { type: 'liveness', subtype: 'proofSubmissions' },
          { type: 'l2costs', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: UnixTime(1756737695), // Sep-01-2025 02:41:35 PM UTC
          programHashes: [
            '793595346346724189681221050719974054861327641387231526786912662354259445535', // Starknet OS (since Starknet v0.14.0)
          ],
        },
        _hackCostMultiplier: 0.17,
      },
      {
        uses: [
          { type: 'liveness', subtype: 'proofSubmissions' },
          { type: 'l2costs', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: UnixTime(1732747391),
          untilTimestamp: UnixTime(1756737695), // 2025/03/24 17:11 UTC
          programHashes: [
            '15787695375210609250491147414005894154890873413229882671403677761527504080', // Aggregator (since Starknet v0.13.3)
          ],
        },
        _hackCostMultiplier: 0.05,
      },
      {
        uses: [
          { type: 'liveness', subtype: 'proofSubmissions' },
          { type: 'l2costs', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: UnixTime(1742836319),
          untilTimestamp: UnixTime(1756737695), // Sep-01-2025 02:41:35 PM UTC
          programHashes: [
            '273279642033703284306509103355536170486431195329675679055627933497997642494', // Aggregator (since Starknet v0.13.4)
          ],
        },
        _hackCostMultiplier: 0.17,
      },
      {
        uses: [
          { type: 'liveness', subtype: 'proofSubmissions' },
          { type: 'l2costs', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: UnixTime(1756737695), // Sep-01-2025 02:41:35 PM UTC
          programHashes: [
            '760308386675154762009993173725077399730170358078020153308029499928875469870', // Aggregator (since Starknet v0.14.0)
          ],
        },
        _hackCostMultiplier: 0.17,
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4',
          ),
          selector: '0x77552641',
          functionSignature:
            'function updateState(uint256[] programOutput, uint256 onchainDataHash, uint256 onchainDataSize)',
          sinceTimestamp: UnixTime(1636979180),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4',
          ),
          selector: '0xb72d42a1',
          functionSignature:
            'function updateStateKzgDA(uint256[] programOutput, bytes kzgProof)',
          sinceTimestamp: UnixTime(1710252995),
          untilTimestamp: UnixTime(1724855579),
        },
      },
      {
        uses: [
          { type: 'liveness', subtype: 'stateUpdates' },
          { type: 'l2costs', subtype: 'stateUpdates' },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4',
          ),
          selector: '0x507ee528',
          functionSignature:
            'function updateStateKzgDA(uint256[] programOutput, bytes[] kzgProofs)',
          sinceTimestamp: UnixTime(1724855579),
        },
      },
      {
        uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xFD14567eaf9ba941cB8c8a94eEC14831ca7fD1b4',
          ),
          selector: '0x5578ceae',
          functionSignature:
            'function registerContinuousMemoryPage(uint256 startAddr,uint256[] values,uint256 z,uint256 alpha,uint256 prime)',
          sinceTimestamp: UnixTime(1678095635),
          untilTimestamp: UnixTime(1706789063),
        },
        _hackCostMultiplier: 0.9,
      },
      {
        uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x40864568f679c10aC9e72211500096a5130770fA',
          ),
          selector: '0x5578ceae',
          functionSignature:
            'function registerContinuousMemoryPage(uint256 startAddr,uint256[] values,uint256 z,uint256 alpha,uint256 prime)',
          sinceTimestamp: UnixTime(1706789063),
          untilTimestamp: UnixTime(1710342000),
        },
        _hackCostMultiplier: 0.9,
      },
      {
        uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x40864568f679c10aC9e72211500096a5130770fA',
          ),
          selector: '0x5578ceae',
          functionSignature:
            'function registerContinuousMemoryPage(uint256 startAddr,uint256[] values,uint256 z,uint256 alpha,uint256 prime)',
          sinceTimestamp: UnixTime(1710342000),
          untilTimestamp: UnixTime(1722197315),
        },
        _hackCostMultiplier: 0.5,
      },
      {
        uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460',
          ),
          selector: '0x5578ceae',
          functionSignature:
            'function registerContinuousMemoryPage(uint256 startAddr,uint256[] values,uint256 z,uint256 alpha,uint256 prime)',
          sinceTimestamp: UnixTime(1722197315),
          untilTimestamp: UnixTime(1732747391),
        },
        _hackCostMultiplier: 0.5,
      },
      {
        uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460',
          ),
          selector: '0x739ef303',
          functionSignature:
            'function registerContinuousPageBatch((uint256 startAddr, uint256[] values, uint256 z, uint256 alpha, uint256 prime)[] memoryPageEntries)',
          sinceTimestamp: UnixTime(1722197315),
          untilTimestamp: UnixTime(1732747391),
        },
        _hackCostMultiplier: 0.5,
      },
      {
        uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460',
          ),
          selector: '0x5578ceae',
          functionSignature:
            'function registerContinuousMemoryPage(uint256 startAddr,uint256[] values,uint256 z,uint256 alpha,uint256 prime)',
          sinceTimestamp: UnixTime(1732747391),
        },
        _hackCostMultiplier: 0.03,
      },
      {
        uses: [{ type: 'l2costs', subtype: 'batchSubmissions' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xe583BcDE0160b637330b27a3ea1F3c02ba2eC460',
          ),
          selector: '0x739ef303',
          functionSignature:
            'function registerContinuousPageBatch((uint256 startAddr, uint256[] values, uint256 z, uint256 alpha, uint256 prime)[] memoryPageEntries)',
          sinceTimestamp: UnixTime(1732747391),
        },
        _hackCostMultiplier: 0.03,
      },
      {
        uses: [{ type: 'l2costs', subtype: 'proofSubmissions' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xDEf8A3b280A54eE7Ed4f72E1c7d6098ad8df44fb',
          ),
          selector: '0xe85a6a28',
          functionSignature:
            'function verifyFRI(uint256[] proof,uint256[] friQueue,uint256 evaluationPoint,uint256 friStepSize,uint256 expectedRoot)',
          sinceTimestamp: UnixTime(1706772791),
          untilTimestamp: UnixTime(1710342000),
        },
        _hackCostMultiplier: 0.7,
      },
      {
        uses: [{ type: 'l2costs', subtype: 'proofSubmissions' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xDEf8A3b280A54eE7Ed4f72E1c7d6098ad8df44fb',
          ),
          selector: '0xe85a6a28',
          functionSignature:
            'function verifyFRI(uint256[] proof,uint256[] friQueue,uint256 evaluationPoint,uint256 friStepSize,uint256 expectedRoot)',
          sinceTimestamp: UnixTime(1710342000),
          untilTimestamp: UnixTime(1715783986), //15.05.2024
        },
        _hackCostMultiplier: 0.65,
      },
      {
        uses: [{ type: 'l2costs', subtype: 'proofSubmissions' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xDEf8A3b280A54eE7Ed4f72E1c7d6098ad8df44fb',
          ),
          selector: '0xe85a6a28',
          functionSignature:
            'function verifyFRI(uint256[] proof,uint256[] friQueue,uint256 evaluationPoint,uint256 friStepSize,uint256 expectedRoot)',
          sinceTimestamp: UnixTime(1715783986), //15.05.2024
          untilTimestamp: UnixTime(1722197315), //28.07.2024
        },
        _hackCostMultiplier: 0.2,
      },
      {
        uses: [{ type: 'l2costs', subtype: 'proofSubmissions' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400',
          ),
          selector: '0xe85a6a28',
          functionSignature:
            'function verifyFRI(uint256[] proof,uint256[] friQueue,uint256 evaluationPoint,uint256 friStepSize,uint256 expectedRoot)',
          sinceTimestamp: UnixTime(1722197315),
          untilTimestamp: UnixTime(1732665600), //27.11
        },
        _hackCostMultiplier: 0.2,
      },
      {
        uses: [{ type: 'l2costs', subtype: 'proofSubmissions' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x30EfaAA99f8eFe310D9FdC83072e2a04c093d400',
          ),
          selector: '0xe85a6a28',
          functionSignature:
            'function verifyFRI(uint256[] proof,uint256[] friQueue,uint256 evaluationPoint,uint256 friStepSize,uint256 expectedRoot)',
          sinceTimestamp: UnixTime(1732665600),
        },
        _hackCostMultiplier: 0.05,
      },
      {
        uses: [{ type: 'l2costs', subtype: 'proofSubmissions' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x634DCf4f1421Fc4D95A968A559a450ad0245804c',
          ),
          selector: '0x3fe317a6',
          functionSignature:
            'function verifyMerkle(uint256[] merkleView,uint256[] initialMerkleQueue,uint256 height,uint256 expectedRoot)',
          sinceTimestamp: UnixTime(1706767355),
          untilTimestamp: UnixTime(1710342000),
        },
        _hackCostMultiplier: 0.7,
      },
      {
        uses: [{ type: 'l2costs', subtype: 'proofSubmissions' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x634DCf4f1421Fc4D95A968A559a450ad0245804c',
          ),
          selector: '0x3fe317a6',
          functionSignature:
            'function verifyMerkle(uint256[] merkleView,uint256[] initialMerkleQueue,uint256 height,uint256 expectedRoot)',
          sinceTimestamp: UnixTime(1710342000),
          untilTimestamp: UnixTime(1715783986),
        },
        _hackCostMultiplier: 0.65,
      },
      {
        uses: [{ type: 'l2costs', subtype: 'proofSubmissions' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x634DCf4f1421Fc4D95A968A559a450ad0245804c',
          ),
          selector: '0x3fe317a6',
          functionSignature:
            'function verifyMerkle(uint256[] merkleView,uint256[] initialMerkleQueue,uint256 height,uint256 expectedRoot)',
          sinceTimestamp: UnixTime(1715783986),
          untilTimestamp: UnixTime(1722197315),
        },
        _hackCostMultiplier: 0.2,
      },
      {
        uses: [{ type: 'l2costs', subtype: 'proofSubmissions' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd',
          ),
          selector: '0x3fe317a6',
          functionSignature:
            'function verifyMerkle(uint256[] merkleView,uint256[] initialMerkleQueue,uint256 height,uint256 expectedRoot)',
          sinceTimestamp: UnixTime(1722197315),
          untilTimestamp: UnixTime(1732665600), //27.11
        },
        _hackCostMultiplier: 0.2,
      },
      {
        uses: [{ type: 'l2costs', subtype: 'proofSubmissions' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x32a91Ff604AB2aDCd832e91D68b2f3f25358FdAd',
          ),
          selector: '0x3fe317a6',
          functionSignature:
            'function verifyMerkle(uint256[] merkleView,uint256[] initialMerkleQueue,uint256 height,uint256 expectedRoot)',
          sinceTimestamp: UnixTime(1732665600),
        },
        _hackCostMultiplier: 0.05,
      },
    ],
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
