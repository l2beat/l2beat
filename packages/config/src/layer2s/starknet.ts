import {
  EthereumAddress,
  formatLargeNumberShared,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import {
  addSentimentToDataAvailability,
  CONTRACTS,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import {
  getProxyGovernance,
  getSHARPVerifierContracts,
  getSHARPVerifierGovernors,
  getSHARPVerifierUpgradeDelay,
} from '../discovery/starkware'
import { delayDescriptionFromSeconds } from '../utils/delayDescription'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('starknet')
const verifierAddress = discovery.getAddressFromValue('Starknet', 'verifier')

const starknetDelaySeconds = discovery.getContractUpgradeabilityParam(
  'Starknet',
  'upgradeDelay',
)

const ESCROW_ETH_ADDRESS = '0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419'
const ESCROW_WBTC_ADDRESS = '0x283751A21eafBFcD52297820D27C1f1963D9b5b4'
const ESCROW_USDC_ADDRESS = '0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816'
const ESCROW_USDT_ADDRESS = '0xbb3400F107804DFB482565FF1Ec8D8aE66747605'
const ESCROW_WSTETH_ADDRESS = '0xBf67F59D2988A46FBFF7ed79A621778a3Cd3985B'
const ESCROW_RETH_ADDRESS = '0xcf58536D6Fab5E59B654228a5a4ed89b13A876C2'
const ESCROW_UNI_ADDRESS = '0xf76e6bF9e2df09D0f854F045A3B724074dA1236B'
const ESCROW_FRAX_ADDRESS = '0xDc687e1E0B85CB589b2da3C47c933De9Db3d1ebb'
const ESCROW_FXS_ADDRESS = '0x66ba83ba3D3AD296424a2258145d9910E9E40B7C'
const ESCROW_SFRXETH_ADDRESS = '0xd8E8531fdD446DF5298819d3Bc9189a5D8948Ee8'
const ESCROW_LUSD_ADDRESS = '0xF3F62F23dF9C1D2C7C63D9ea6B90E8d24c7E3DF5'
const ESCROW_LORDS_ADDRESS = '0x023A2aAc5d0fa69E3243994672822BA43E34E5C9'
const ESCROW_STRK_ADDRESS = '0xcE5485Cfb26914C5dcE00B9BAF0580364daFC7a4'

const escrowETHDelaySeconds = discovery.getContractUpgradeabilityParam(
  ESCROW_ETH_ADDRESS,
  'upgradeDelay',
)
const escrowWBTCDelaySeconds = discovery.getContractUpgradeabilityParam(
  ESCROW_WBTC_ADDRESS,
  'upgradeDelay',
)
const escrowUSDCDelaySeconds = discovery.getContractUpgradeabilityParam(
  ESCROW_USDC_ADDRESS,
  'upgradeDelay',
)
const escrowUSDTDelaySeconds = discovery.getContractUpgradeabilityParam(
  ESCROW_USDT_ADDRESS,
  'upgradeDelay',
)
const escrowWSTETHDelaySeconds = discovery.getContractUpgradeabilityParam(
  ESCROW_WSTETH_ADDRESS,
  'upgradeDelay',
)
const escrowRETHDelaySeconds = discovery.getContractUpgradeabilityParam(
  ESCROW_RETH_ADDRESS,
  'upgradeDelay',
)
const escrowUNIDelaySeconds = discovery.getContractUpgradeabilityParam(
  ESCROW_UNI_ADDRESS,
  'upgradeDelay',
)
const escrowFRAXDelaySeconds = discovery.getContractUpgradeabilityParam(
  ESCROW_FRAX_ADDRESS,
  'upgradeDelay',
)
const escrowSFRXETHDelaySeconds = discovery.getContractUpgradeabilityParam(
  ESCROW_SFRXETH_ADDRESS,
  'upgradeDelay',
)
const escrowFXSDelaySeconds = discovery.getContractUpgradeabilityParam(
  ESCROW_FXS_ADDRESS,
  'upgradeDelay',
)
const escrowLUSDDelaySeconds = discovery.getContractUpgradeabilityParam(
  ESCROW_LUSD_ADDRESS,
  'upgradeDelay',
)
const escrowSTRKDelaySeconds = discovery.getContractUpgradeabilityParam(
  ESCROW_STRK_ADDRESS,
  'upgradeDelay',
)

const minDelay = Math.min(
  escrowETHDelaySeconds,
  escrowWBTCDelaySeconds,
  escrowUSDCDelaySeconds,
  escrowUSDTDelaySeconds,
  starknetDelaySeconds,
  escrowWSTETHDelaySeconds,
  escrowRETHDelaySeconds,
  escrowSTRKDelaySeconds,
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
  } else {
    return `The current bridge cap is ${formatLargeNumberShared(
      maxTotalBalance / 10 ** decimals,
    )} ${ticker}.`
  }
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
  'FRAX',
  discovery.getContractValue<number>('FRAXBridge', 'maxTotalBalance'),
  18,
)

const escrowFXSMaxTotalBalanceString = formatMaxTotalBalanceString(
  'FXS',
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

export const starknet: Layer2 = {
  type: 'layer2',
  id: ProjectId('starknet'),
  display: {
    name: 'Starknet',
    slug: 'starknet',
    provider: 'Starknet',
    description:
      'Starknet is a general purpose ZK Rollup based on STARKs and the Cairo VM.',
    purposes: ['Universal'],
    category: 'ZK Rollup',

    links: {
      apps: ['https://dappland.com/', 'https://starknet-ecosystem.com/'],
      websites: [
        'https://starknet.io/',
        'https://starkware.co/starknet/',
        'https://starkware.co/ecosystem/',
        'https://community.starknet.io/',
      ],
      documentation: ['https://starknet.io/learn/what-is-starknet'],
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
    activityDataSource: 'Blockchain RPC',
    liveness: {
      explanation:
        'Starknet is a ZK rollup that posts state diffs to the L1. For a transaction to be considered final, the state diffs have to be submitted and validity proof should be generated, submitted, and verified. Proofs are aggregated with other projects using SHARP and state updates have to refer to proved claims.',
    },
    finality: {
      finalizationPeriod: 0,
    },
  },
  config: {
    associatedTokens: ['STRK'],
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_ETH_ADDRESS),
        sinceTimestamp: new UnixTime(1647857148),
        tokens: ['ETH'],
        description:
          'StarkGate bridge for ETH.' + ' ' + escrowETHMaxTotalBalanceString,
        upgradableBy: ['StarkGate ETH owner', 'BridgeMultisig'],
        upgradeDelay: formatSeconds(escrowETHDelaySeconds),
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x0437465dfb5B79726e35F08559B0cBea55bb585C'),
        sinceTimestamp: new UnixTime(1652101033),
        tokens: ['DAI'],
        description:
          'DAI Vault for custom DAI Gateway managed by MakerDAO.' +
          ' ' +
          escrowDAIMaxTotalBalanceString,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_WBTC_ADDRESS),
        sinceTimestamp: new UnixTime(1657137600),
        tokens: ['WBTC'],
        description:
          'StarkGate bridge for WBTC.' + ' ' + escrowWBTCMaxTotalBalanceString,
        upgradableBy: ['StarkGate WBTC owner', 'BridgeMultisig'],
        upgradeDelay: formatSeconds(escrowWBTCDelaySeconds),
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_USDC_ADDRESS),
        sinceTimestamp: new UnixTime(1657137639),
        tokens: ['USDC'],
        upgradableBy: ['StarkGate USDC owner', 'BridgeMultisig'],
        description:
          'StarkGate bridge for USDC.' + ' ' + escrowUSDCMaxTotalBalanceString,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_USDT_ADDRESS),
        sinceTimestamp: new UnixTime(1657137615),
        tokens: ['USDT'],
        description:
          'StarkGate bridge for USDT.' + ' ' + escrowUSDTMaxTotalBalanceString,
        upgradableBy: ['StarkGate USDT owner', 'BridgeMultisig'],
        upgradeDelay: formatSeconds(escrowUSDTDelaySeconds),
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_WSTETH_ADDRESS),
        sinceTimestamp: new UnixTime(1657137623),
        tokens: ['wstETH'],
        description:
          'StarkGate bridge for wstETH.' +
          ' ' +
          escrowWSTETHMaxTotalBalanceString,
        upgradableBy: ['StarkGate wstETH owner'],
        upgradeDelay: formatSeconds(escrowWSTETHDelaySeconds),
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_RETH_ADDRESS),
        sinceTimestamp: new UnixTime(1657137623),
        tokens: ['rETH'],
        description:
          'StarkGate bridge for rETH.' + ' ' + escrowRETHMaxTotalBalanceString,
        upgradableBy: ['StarkGate rETH owner'],
        upgradeDelay: formatSeconds(escrowRETHDelaySeconds),
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_UNI_ADDRESS),
        tokens: ['UNI'],
        description:
          'StarkGate bridge for UNI.' + ' ' + escrowUNIMaxTotalBalanceString,
        upgradableBy: ['StarkGate UNI owner'],
        upgradeDelay: formatSeconds(escrowUNIDelaySeconds),
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_FRAX_ADDRESS),
        tokens: ['FRAX'],
        description:
          'StarkGate bridge for FRAX.' + ' ' + escrowFRAXMaxTotalBalanceString,
        upgradableBy: ['StarkGate FRAX owner'],
        upgradeDelay: formatSeconds(escrowFRAXDelaySeconds),
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_FXS_ADDRESS),
        tokens: ['FXS'],
        description:
          'StarkGate bridge for FXS.' + ' ' + escrowFXSMaxTotalBalanceString,
        upgradableBy: ['StarkGate FXS owner'],
        upgradeDelay: formatSeconds(escrowFXSDelaySeconds),
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_SFRXETH_ADDRESS),
        tokens: ['sfrxETH'],
        description:
          'StarkGate bridge for sfrxETH.' +
          ' ' +
          escrowSFRXETHMaxTotalBalanceString,
        upgradableBy: ['StarkGate sfrxETH owner'],
        upgradeDelay: formatSeconds(escrowSFRXETHDelaySeconds),
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_LUSD_ADDRESS),
        tokens: ['LUSD'],
        description:
          'StarkGate bridge for LUSD.' + ' ' + escrowLUSDMaxTotalBalanceString,
        upgradableBy: ['StarkGate LUSD owner'],
        upgradeDelay: formatSeconds(escrowLUSDDelaySeconds),
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_LORDS_ADDRESS),
        tokens: ['LORDS'],
        description: 'StarkGate bridge for LORDS.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_STRK_ADDRESS),
        tokens: ['STRK'],
        description:
          'StarkGate bridge for STRK.' + ' ' + escrowSTRKMaxTotalBalanceString,
        upgradeDelay: formatSeconds(escrowSTRKDelaySeconds),
      }),
    ],
    transactionApi: {
      type: 'starknet',
      defaultUrl: 'https://starknet-mainnet.public.blastapi.io',
      defaultCallsPerMinute: 120,
    },
    finality: 'coming soon',
    trackedTxs: [
      {
        uses: [{ type: 'liveness', subtype: 'proofSubmissions' }],
        query: {
          formula: 'sharpSubmission',
          sinceTimestampInclusive: new UnixTime(1636978914),
          untilTimestampExclusive: new UnixTime(1702921247),
          programHashes: [
            '1865367024509426979036104162713508294334262484507712987283009063059134893433',
          ],
        },
      },
      {
        uses: [{ type: 'liveness', subtype: 'proofSubmissions' }],
        query: {
          formula: 'sharpSubmission',
          sinceTimestampInclusive: new UnixTime(1702921247),
          untilTimestampExclusive: new UnixTime(1704855731),
          programHashes: [
            '54878256403880350656938046611252303365750679698042371543935159963667935317',
          ],
        },
      },
      {
        uses: [{ type: 'liveness', subtype: 'proofSubmissions' }],
        query: {
          formula: 'sharpSubmission',
          sinceTimestampInclusive: new UnixTime(1704855731),
          untilTimestampExclusive: new UnixTime(1710252995),
          programHashes: [
            '2479841346739966073527450029179698923866252973805981504232089731754042431018',
          ],
        },
      },
      {
        uses: [{ type: 'liveness', subtype: 'proofSubmissions' }],
        query: {
          formula: 'sharpSubmission',
          sinceTimestampInclusive: new UnixTime(1710252995),
          untilTimestampExclusive: new UnixTime(1710625271),
          programHashes: [
            '109586309220455887239200613090920758778188956576212125550190099009305121410',
          ],
        },
      },
      {
        uses: [{ type: 'liveness', subtype: 'proofSubmissions' }],
        query: {
          formula: 'sharpSubmission',
          sinceTimestampInclusive: new UnixTime(1710625271),
          programHashes: [
            '3383082961563516565935611087683915026448707331436034043529592588079494402084',
          ],
        },
      },
      {
        uses: [{ type: 'liveness', subtype: 'stateUpdates' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4',
          ),
          selector: '0x77552641',
          functionSignature:
            'function updateState(uint256[] programOutput, uint256 onchainDataHash, uint256 onchainDataSize)',
          sinceTimestampInclusive: new UnixTime(1636978914),
        },
      },
      {
        uses: [{ type: 'liveness', subtype: 'stateUpdates' }],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4',
          ),
          selector: '0xb72d42a1',
          functionSignature:
            'function updateStateKzgDA(uint256[] programOutput, bytes kzgProof)',
          sinceTimestampInclusive: new UnixTime(1710252995),
        },
      },
    ],
  },
  dataAvailability: addSentimentToDataAvailability({
    layers: ['Ethereum (blobs or calldata)'],
    bridge: { type: 'Enshrined' },
    mode: 'State diffs',
  }),
  riskView: makeBridgeCompatible({
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_ST,
      sources: [
        {
          contract: 'Starknet',
          references: [
            'https://etherscan.io/address/0x6E0aCfDC3cf17A7f99ed34Be56C3DFb93F464e24#code',
          ],
        },
        // we don't have a way to test against shared modules
        // {
        //   contract: 'GpsStatementVerifier',
        //   references: [
        //     'https://etherscan.io/address/0x6cb3ee90c50a38a0e4662bb7e7e6e40b91361bf6#code#F6#L153',
        //   ],
        // },
      ],
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN_STATE_DIFFS,
      sources: [
        {
          contract: 'Starknet',
          references: [
            'https://etherscan.io/address/0x6E0aCfDC3cf17A7f99ed34Be56C3DFb93F464e24#code',
          ],
        },
      ],
    },
    exitWindow: RISK_VIEW.EXIT_WINDOW(minDelay, 0),
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_NO_MECHANISM(),
      sources: [
        {
          contract: 'Starknet',
          references: [
            'https://etherscan.io/address/0x6E0aCfDC3cf17A7f99ed34Be56C3DFb93F464e24#code',
          ],
        },
      ],
    },
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
      },
      stage1: {
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: null,
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: false,
        securityCouncilProperlySetUp: null,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: null,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/NethermindEth/juno',
    },
  ),
  technology: {
    stateCorrectness: {
      ...STATE_CORRECTNESS.VALIDITY_PROOFS,
      references: [
        {
          text: 'What is Starknet',
          href: 'https://starkware.co/starknet/',
        },
      ],
    },
    newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
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
          text: 'Censorship resistance of Starknet - Forum Discussion',
          href: 'https://community.starknet.io/t/censorship-resistance/196',
        },
      ],
    },
    exitMechanisms: EXITS.STARKNET,
  },
  stateDerivation: {
    nodeSoftware:
      'The [Juno](https://github.com/NethermindEth/juno) node software can be used to reconstruct the L2 state entirely from L1. The feature has not been released yet, but can be found in this [PR](https://github.com/NethermindEth/juno/pull/1335).',
    compressionScheme: "Starknet doesn't use any compression scheme.",
    genesisState: 'There is no non-empty genesis state.',
    dataFormat:
      'The data format has been updated with different versions, and the full specification can be found [here](https://docs.starknet.io/documentation/architecture_and_concepts/Network_Architecture/on-chain-data/).',
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('Starknet', {
        description:
          'Starknet contract receives (verified) state roots from the Sequencer, allows users to read L2 -> L1 messages and send L1 -> L2 message.',
        upgradeDelay: starknetDelaySeconds
          ? formatSeconds(starknetDelaySeconds)
          : 'No delay',
        upgradableBy: ['Starknet Proxy Governors'],
      }),
      ...getSHARPVerifierContracts(discovery, verifierAddress),
      discovery.getContractDetails(
        'L1DaiGateway',
        'Custom DAI Gateway, main entry point for users depositing DAI to L2 where "canonical" L2 DAI token managed by MakerDAO will be minted. Managed by MakerDAO.',
      ),
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_SECONDS_RISK(minDelay)],
  },
  upgradesAndGovernance: `
The Upgrading mechanism of Starknet follows a similar scheme for all of their smart contracts. A contract initializes with the creator of the contract as a Governor, who can then nominate or remove other Governors allowing them to call restricted governor functions.

The Starknet core contract is upgradable by 2 appointed \`Starknet Proxy Governors\`: A Proxy multisig with a ${discovery.getMultisigStats('ProxyMultisig')} threshold and an EOA. Implementations can be upgraded ${starknetDelaySeconds === 0 ? 'without delay, thus users are not provided with an exit window in case of unwanted upgrades.' : 'with a delay of ' + formatSeconds(starknetDelaySeconds) + '.'}

\`Starknet Implementation Governors\` have the authority to execute governed functions that modify contract parameters without delay. These actions encompass registering/removing Operators, specifying the program and config hash, or setting the Message Cancellation Delay between L1 and L2. Currently it is governed by a Multisig with a ${discovery.getMultisigStats('ImplementationMultisig')} threshold and an EOA. The verifier address is set upon initialization of the Starknet Implementation contract.

Via the proxy contracts, the \`SHARP Verifier Governors\` can upgrade the GPSStatement Verifier implementation. It is important to note that the state is also maintained in the implementation contract, rather than in the proxy itself. An upgrade to the Verifier could potentially introduce code that approves fraudulent states. Currently, there is ${getSHARPVerifierUpgradeDelay() === 0 ? 'no' : 'a ' + formatSeconds(getSHARPVerifierUpgradeDelay())} delay before any upgrade takes effect.

The StarkGate bridge escrows are mostly governed and upgraded by a Bridge Multisig, others by different owners. (see Permissions section)

At present, the StarkNet Foundation hosts voting for STRK token holders (or their delegates) regarding protocol updates to reflect community intent, however, there is no direct authority to implement the execution of these upgrades.`,
  permissions: [
    {
      name: 'Starknet Proxy Governors',
      accounts: getProxyGovernance(discovery, 'Starknet'),
      description:
        'Can upgrade implementation of the system, potentially gaining access to all funds stored in the bridge. Can also upgrade implementation of the StarknetCore contract, potentially allowing fraudulent state to be posted. ' +
        delayDescriptionFromSeconds(starknetDelaySeconds),
    },
    ...discovery.getMultisigPermission(
      'ProxyMultisig',
      'One of Proxy Governors.',
    ),
    {
      name: 'Starknet Implementation Governors',
      accounts: discovery.getPermissionedAccounts('Starknet', 'governors'),
      description:
        'The governors are responsible for: appointing operators, changing program hash, changing config hash, changing message cancellation delay. There is no delay on governor actions.',
    },
    ...getSHARPVerifierGovernors(discovery, verifierAddress),
    {
      name: 'Operators',
      accounts: discovery.getPermissionedAccounts('Starknet', 'operators'),
      description:
        'Allowed to post state updates. When the operator is down the state cannot be updated.',
    },
    {
      name: 'MakerDAO Governance',
      accounts: [
        {
          address: EthereumAddress(
            '0x0a3f6849f78076aefaDf113F5BED87720274dDC0',
          ),
          type: 'Contract',
        },
      ],
      description:
        'In DAI bridge it can set max deposit per bridge and per user. In DAI escrow it can approve token transfers.',
    },
    {
      name: 'StarkGate ETH owner',
      accounts: getProxyGovernance(discovery, ESCROW_ETH_ADDRESS),
      description:
        'Can upgrade implementation of the ETH escrow, potentially gaining access to all funds stored in the bridge. ' +
        delayDescriptionFromSeconds(escrowETHDelaySeconds),
    },
    {
      name: 'StarkGate WBTC owner',
      accounts: getProxyGovernance(discovery, ESCROW_WBTC_ADDRESS),
      description:
        'Can upgrade implementation of the WBTC escrow, potentially gaining access to all funds stored in the bridge. ' +
        delayDescriptionFromSeconds(escrowWBTCDelaySeconds),
    },
    {
      name: 'StarkGate USDC owner',
      accounts: getProxyGovernance(discovery, ESCROW_USDC_ADDRESS),
      description:
        'Can upgrade implementation of the USDC escrow, potentially gaining access to all funds stored in the bridge. ' +
        delayDescriptionFromSeconds(escrowUSDCDelaySeconds),
    },
    {
      name: 'StarkGate USDT owner',
      accounts: getProxyGovernance(discovery, ESCROW_USDT_ADDRESS),
      description:
        'Can upgrade implementation of the USDT escrow, potentially gaining access to all funds stored in the bridge. ' +
        delayDescriptionFromSeconds(escrowUSDTDelaySeconds),
    },
    {
      name: 'StarkGate wstETH owner',
      accounts: getProxyGovernance(discovery, ESCROW_WSTETH_ADDRESS),
      description:
        'Can upgrade implementation of the wstETH escrow, potentially gaining access to all funds stored in the bridge. ' +
        delayDescriptionFromSeconds(escrowWSTETHDelaySeconds),
    },
    {
      name: 'StarkGate rETH owner',
      accounts: getProxyGovernance(discovery, ESCROW_RETH_ADDRESS),
      description:
        'Can upgrade implementation of the rETH escrow, potentially gaining access to all funds stored in the bridge. ' +
        delayDescriptionFromSeconds(escrowRETHDelaySeconds),
    },
    {
      name: 'StarkGate UNI owner',
      accounts: getProxyGovernance(discovery, ESCROW_UNI_ADDRESS),
      description:
        'Can upgrade implementation of the UNI escrow, potentially gaining access to all funds stored in the bridge. ' +
        delayDescriptionFromSeconds(escrowUNIDelaySeconds),
    },
    {
      name: 'StarkGate FRAX owner',
      accounts: getProxyGovernance(discovery, ESCROW_FRAX_ADDRESS),
      description:
        'Can upgrade implementation of the FRAX escrow, potentially gaining access to all funds stored in the bridge. ' +
        delayDescriptionFromSeconds(escrowFRAXDelaySeconds),
    },
    {
      name: 'StarkGate FXS owner',
      accounts: getProxyGovernance(discovery, ESCROW_FXS_ADDRESS),
      description:
        'Can upgrade implementation of the FXS escrow, potentially gaining access to all funds stored in the bridge. ' +
        delayDescriptionFromSeconds(escrowFXSDelaySeconds),
    },
    {
      name: 'StarkGate sfrxETH owner',
      accounts: getProxyGovernance(discovery, ESCROW_SFRXETH_ADDRESS),
      description:
        'Can upgrade implementation of the sfrxETH escrow, potentially gaining access to all funds stored in the bridge. ' +
        delayDescriptionFromSeconds(escrowSFRXETHDelaySeconds),
    },
    {
      name: 'StarkGate LUSD owner',
      accounts: getProxyGovernance(discovery, ESCROW_LUSD_ADDRESS),
      description:
        'Can upgrade implementation of the LUSD escrow, potentially gaining access to all funds stored in the bridge. ' +
        delayDescriptionFromSeconds(escrowLUSDDelaySeconds),
    },
    ...discovery.getMultisigPermission(
      'BridgeMultisig',
      'Can upgrade the following bridges: FRAX, FXS, sfrxETH, USDT, WBTC, ETH, USDT, and additional permissions on other bridges, like setting the max total balance or activate withdrawal limits.',
    ),
    {
      name: 'StarkGate STRK owner',
      accounts: discovery.getAccessControlRolePermission(
        'STRKBridge',
        'GOVERNANCE_ADMIN',
      ),
      description:
        'Can upgrade implementation of the STRK escrow, potentially gaining access to all funds stored in the bridge. ' +
        delayDescriptionFromSeconds(escrowSTRKDelaySeconds),
    },
  ],
  milestones: [
    {
      name: 'Starknet Provisions',
      link: 'https://www.starknet.io/en/content/starknet-provisions-program',
      date: '2024-02-14T00:00:00Z',
      description:
        'Starknet begins allocating $STRK to early contributors and users.',
    },
    {
      name: 'Starknet Alpha',
      link: 'https://medium.com/starkware/starknet-alpha-now-on-mainnet-4cf35efd1669',
      date: '2021-11-29T00:00:00Z',
      description:
        'Rollup is live on mainnet, enabling general computation using ZK Rollup technology.',
    },
    {
      name: 'StarkGate Alpha',
      link: 'https://medium.com/starkware/starkgate-alpha-35d01d21e3af',
      date: '2022-05-09T00:00:00Z',
      description:
        'Bridge is live on mainnet, serving as gateway between Ethereum and Starknet.',
    },
  ],
  knowledgeNuggets: [...NUGGETS.STARKWARE],
}
