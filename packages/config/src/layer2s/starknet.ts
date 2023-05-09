import {
  EthereumAddress,
  formatLargeNumber,
  ProjectId,
  UnixTime,
} from '@l2beat/shared'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import {
  getProxyGovernance,
  getSHARPVerifierContracts,
  getSHARPVerifierGovernors,
} from '../discovery/starkware'
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
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('starknet')
const verifierAddress = discovery.getAddressFromValue('Starknet', 'verifier')
const bridgeLimitETH =
  discovery.getContractValue<number>('StarknetEthBridge', 'maxTotalBalance') /
  1e18
const bridgeLimitUSDC =
  discovery.getContractValue<number>('USDC Bridge', 'maxTotalBalance') / 1e6
const bridgeLimitWBTC =
  discovery.getContractValue<number>('WBTC Bridge', 'maxTotalBalance') / 1e8
const bridgeLimitUSDT =
  discovery.getContractValue<number>('USDT Bridge', 'maxTotalBalance') / 1e6

export const starknet: Layer2 = {
  type: 'layer2',
  id: ProjectId('starknet'),
  display: {
    name: 'StarkNet',
    slug: 'starknet',
    description:
      'StarkNet is a general purpose ZK-Rollup built using STARK cryptographic proof system. StarkNet uses the Cairo programming language both for its \
      infrastructure and for writing StarkNet contracts. L2 <--> L1 messaging infrastructure \
      is available and contracts are fully composable. It is currently launched \
      with a single Sequencer.',
    purpose: 'Universal',
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
      {
        address: discovery.getContract('StarknetEthBridge').address,
        sinceTimestamp: new UnixTime(1647857148),
        tokens: ['ETH'],
      },
      {
        address: discovery.getContract('DAI Bridge').address,
        sinceTimestamp: new UnixTime(1652101033),
        tokens: ['DAI'],
      },
      {
        address: discovery.getContract('WBTC Bridge').address,
        sinceTimestamp: new UnixTime(1657137600),
        tokens: ['WBTC'],
      },
      {
        address: discovery.getContract('USDC Bridge').address,
        sinceTimestamp: new UnixTime(1657137639),
        tokens: ['USDC'],
      },
      {
        address: discovery.getContract('USDT Bridge').address,
        sinceTimestamp: new UnixTime(1657137615),
        tokens: ['USDT'],
      },
    ],
    transactionApi: {
      type: 'starknet',
      callsPerMinute: 60 * 5,
      url: 'https://alpha-mainnet.starknet.io',
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_ST,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    upgradeability: RISK_VIEW.UPGRADABLE_YES,
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM,
    validatorFailure: RISK_VIEW.PROVER_DOWN,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    category: 'ZK Rollup',
    stateCorrectness: {
      ...STATE_CORRECTNESS.VALIDITY_PROOFS,
      references: [
        {
          text: 'What is StarkNet',
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
        ' Typically, the Operator is the hot wallet of the StarkNet service submitting state updates for which proofs have been already submitted and verified.',
      references: [
        {
          text: 'StarkNet operator Etherscan address',
          href: 'https://etherscan.io/address/0x2C169DFe5fBbA12957Bdd0Ba47d9CEDbFE260CA7',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.NO_MECHANISM,
      references: [
        {
          text: 'Censorship resistance of StarkNet - Forum Discussion',
          href: 'https://community.starknet.io/t/censorship-resistance/196',
        },
      ],
    },
    exitMechanisms: EXITS.STARKNET,
  },
  contracts: {
    addresses: [
      {
        name: 'StarkNet Core Contract',
        description:
          'StarkNet contract receives (verified) state roots from the Sequencer, allows users to read L2 -> L1 messages and send L1 -> L2 message.',
        address: discovery.getContract('Starknet').address,
        upgradeability: discovery.getContract('Starknet').upgradeability,
      },
      ...getSHARPVerifierContracts(discovery, verifierAddress),
      {
        name: 'Eth Bridge',
        description: `Starkgate bridge for ETH, currently the limit is ${formatLargeNumber(
          bridgeLimitETH,
        )} ETH.`,
        address: discovery.getContract('StarknetEthBridge').address,
        upgradeability:
          discovery.getContract('StarknetEthBridge').upgradeability,
      },
      {
        name: 'L1DaiGateway',
        description:
          'Custom DAI Gateway, main entry point for users depositing DAI to L2 where "canonical" L2 DAI token managed by MakerDAO will be minted. Managed by MakerDAO.',
        address: EthereumAddress('0x9F96fE0633eE838D0298E8b8980E6716bE81388d'),
      },
      {
        name: 'L1Escrow',
        description: 'DAI Vault for custom DAI Gateway managed by MakerDAO.',
        address: discovery.getContract('DAI Bridge').address,
      },
      discovery.getMainContractDetails(
        'WBTC Bridge',
        `StarkGate bridge for WBTC, currently the limit is ${formatLargeNumber(
          bridgeLimitWBTC,
        )} WBTC.`,
      ),
      discovery.getMainContractDetails(
        'USDC Bridge',
        `StarkGate bridge for USDC, currently the limit is ${formatLargeNumber(
          bridgeLimitUSDC,
        )} USDC.`,
      ),
      discovery.getMainContractDetails(
        'USDT Bridge',
        `StarkGate bridge for USDT, currently the limit is ${formatLargeNumber(
          bridgeLimitUSDT,
        )} USDT.`,
      ),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    {
      name: 'StarknetCore Governors',
      accounts: getProxyGovernance(discovery, 'Starknet'),
      description:
        'Can upgrade implementation of the system, potentially gaining access to all funds stored in the bridge. Can also upgrade implementation of the StarknetCore contract, potentially allowing fraudulent state to be posted.',
    },
    ...getSHARPVerifierGovernors(discovery, verifierAddress),
    {
      name: 'Operators',
      accounts: discovery.getPermissionedAccountsList('Starknet', 'OPERATORS'),
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
  ],
  milestones: [
    {
      name: 'StarkNet Alpha',
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
        'Bridge is live on mainnet, serving as gateway between Ethereum and StarkNet.',
    },
  ],
  knowledgeNuggets: [...NUGGETS.STARKWARE],
}
