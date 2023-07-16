import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import {
  getProxyGovernance,
  getSHARPVerifierContracts,
  getSHARPVerifierGovernors,
} from '../discovery/starkware'
import { delayDescriptionFromSeconds } from '../utils/delayDescription'
import { formatSeconds } from '../utils/formatSeconds'
import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
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

const minDelay = Math.min(
  escrowETHDelaySeconds,
  escrowWBTCDelaySeconds,
  escrowUSDCDelaySeconds,
  escrowUSDTDelaySeconds,
  starknetDelaySeconds,
)

export const starknet: Layer2 = {
  type: 'layer2',
  id: ProjectId('starknet'),
  display: {
    name: 'Starknet',
    slug: 'starknet',
    description:
      'Starknet is a general purpose ZK-Rollup built using STARK cryptographic proof system. Starknet uses the Cairo programming language both for its \
      infrastructure and for writing Starknet contracts. L2 <--> L1 messaging infrastructure \
      is available and contracts are fully composable. It is currently launched \
      with a single Sequencer.',
    purpose: 'Universal',
    category: 'ZK Rollup',
    links: {
      apps: [],
      websites: [
        'https://starknet.io/',
        'https://starkware.co/starknet/',
        'https://starkware.co/ecosystem/',
        'https://community.starknet.io/',
      ],
      documentation: ['https://starknet.io/what-is-starknet/'],
      explorers: ['https://voyager.online/', 'https://starkscan.co/'],
      repositories: ['https://github.com/starkware-libs'],
      socialMedia: [
        'https://discord.gg/uJ9HZTUk2Y',
        'https://twitter.com/StarkWareLtd',
        'https://medium.com/starkware',
        'https://starkware.co/',
      ],
    },
    activityDataSource: 'Explorer API',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_ETH_ADDRESS),
        sinceTimestamp: new UnixTime(1647857148),
        tokens: ['ETH'],
        description: 'StarkGate bridge for ETH.',
        upgradableBy: ['StarkGate ETH owner'],
        upgradeDelay: formatSeconds(escrowETHDelaySeconds),
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x0437465dfb5B79726e35F08559B0cBea55bb585C'),
        sinceTimestamp: new UnixTime(1652101033),
        tokens: ['DAI'],
        description: 'DAI Vault for custom DAI Gateway managed by MakerDAO.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_WBTC_ADDRESS),
        sinceTimestamp: new UnixTime(1657137600),
        tokens: ['WBTC'],
        description: 'StarkGate bridge for WBTC.',
        upgradableBy: ['StarkGate WBTC owner'],
        upgradeDelay: formatSeconds(escrowWBTCDelaySeconds),
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_USDC_ADDRESS),
        sinceTimestamp: new UnixTime(1657137639),
        tokens: ['USDC'],
        upgradableBy: ['StarkGate USDC owner'],
        description: 'StarkGate bridge for USDC.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_USDT_ADDRESS),
        sinceTimestamp: new UnixTime(1657137615),
        tokens: ['USDT'],
        description: 'StarkGate bridge for USDT.',
        upgradableBy: ['StarkGate USDT owner'],
        upgradeDelay: formatSeconds(escrowUSDTDelaySeconds),
      }),
    ],
    transactionApi: {
      type: 'starknet',
      callsPerMinute: 60 * 5,
      url: 'https://alpha-mainnet.starknet.io',
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_ST,
      sources: [
        {
          contract: 'Starknet',
          references: [
            'https://etherscan.io/address/0x16938E4b59297060484Fa56a12594d8D6F4177e8#code#F1#L218',
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
            'https://etherscan.io/address/0x16938E4b59297060484Fa56a12594d8D6F4177e8#code#F1#L213',
          ],
        },
      ],
    },
    upgradeability: RISK_VIEW.UPGRADE_DELAY_SECONDS(minDelay),
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_NO_MECHANISM(),
      sources: [
        {
          contract: 'Starknet',
          references: [
            'https://etherscan.io/address/0x16938E4b59297060484Fa56a12594d8D6F4177e8#code#F1#L199',
          ],
        },
      ],
    },
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeOpenSource: 'UnderReview',
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
  }),
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
    dataAvailability: DATA_AVAILABILITY.STARKNET_ON_CHAIN,
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      description:
        OPERATOR.CENTRALIZED_OPERATOR.description +
        ' Typically, the Operator is the hot wallet of the Starknet service submitting state updates for which proofs have been already submitted and verified.',
      references: [
        {
          text: 'Starknet operator Etherscan address',
          href: 'https://etherscan.io/address/0x2C169DFe5fBbA12957Bdd0Ba47d9CEDbFE260CA7',
        },
      ],
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
  permissions: [
    {
      name: 'Starknet Proxy Governors',
      accounts: getProxyGovernance(discovery, 'Starknet'),
      description:
        'Can upgrade implementation of the system, potentially gaining access to all funds stored in the bridge. Can also upgrade implementation of the StarknetCore contract, potentially allowing fraudulent state to be posted. ' +
        delayDescriptionFromSeconds(starknetDelaySeconds),
    },
    ...discovery.getMultisigPermission(
      'Proxy Multisig',
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
  ],
  milestones: [
    {
      name: 'Starknet Alpha',
      link: 'https://medium.com/starkware/starknet-alpha-now-on-mainnet-4cf35efd1669',
      date: '2021-11-29T00:00:00Z',
      description:
        'Rollup is live on mainnet, enabling general computation using zkRollup technology.',
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
