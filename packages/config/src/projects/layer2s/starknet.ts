import {
  assert,
  ChainId,
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatLargeNumber,
  formatSeconds,
} from '@l2beat/shared-pure'

import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { ESCROW } from '../../common'
import { formatExecutionDelay } from '../../common/formatDelays'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  getProxyGovernance,
  getSHARPVerifierContracts,
  getSHARPVerifierGovernors,
  getSHARPVerifierUpgradeDelay,
} from '../../discovery/starkware'
import type { Layer2 } from '../../types'
import { delayDescriptionFromSeconds } from '../../utils/delayDescription'
import { Badge } from '../badges'
import { PROOFS } from '../zk-catalog/common/proofSystems'
import { getStage } from './common/stages/getStage'

const discovery = new ProjectDiscovery('starknet')
const verifierAddress = discovery.getAddressFromValue('Starknet', 'verifier')

const starknetDelaySeconds = discovery.getContractValue<number>(
  'Starknet',
  'StarkWareProxy_upgradeDelay',
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
const ESCROW_MULTIBRIDGE_ADDRESS = '0xF5b6Ee2CAEb6769659f6C091D209DfdCaF3F69Eb'

const escrowETHDelaySeconds = discovery.getContractValue<number>(
  ESCROW_ETH_ADDRESS,
  'StarkWareProxy_upgradeDelay',
)
const escrowWBTCDelaySeconds = discovery.getContractValue<number>(
  ESCROW_WBTC_ADDRESS,
  'StarkWareProxy_upgradeDelay',
)
const escrowUSDCDelaySeconds = discovery.getContractValue<number>(
  ESCROW_USDC_ADDRESS,
  'StarkWareProxy_upgradeDelay',
)
const escrowUSDTDelaySeconds = discovery.getContractValue<number>(
  ESCROW_USDT_ADDRESS,
  'StarkWareProxy_upgradeDelay',
)
const escrowWSTETHDelaySeconds = discovery.getContractValue<number>(
  ESCROW_WSTETH_ADDRESS,
  'StarkWareProxy_upgradeDelay',
)
const escrowRETHDelaySeconds = discovery.getContractValue<number>(
  ESCROW_RETH_ADDRESS,
  'StarkWareProxy_upgradeDelay',
)
const escrowUNIDelaySeconds = discovery.getContractValue<number>(
  ESCROW_UNI_ADDRESS,
  'StarkWareProxy_upgradeDelay',
)
const escrowFRAXDelaySeconds = discovery.getContractValue<number>(
  ESCROW_FRAX_ADDRESS,
  'StarkWareProxy_upgradeDelay',
)
const escrowSFRXETHDelaySeconds = discovery.getContractValue<number>(
  ESCROW_SFRXETH_ADDRESS,
  'StarkWareProxy_upgradeDelay',
)
const escrowFXSDelaySeconds = discovery.getContractValue<number>(
  ESCROW_FXS_ADDRESS,
  'StarkWareProxy_upgradeDelay',
)
const escrowLUSDDelaySeconds = discovery.getContractValue<number>(
  ESCROW_LUSD_ADDRESS,
  'StarkWareProxy_upgradeDelay',
)
const escrowSTRKDelaySeconds = discovery.getContractValue<number>(
  ESCROW_STRK_ADDRESS,
  'StarkWareProxy_upgradeDelay',
)
const escrowMultibridgeDelaySeconds = discovery.getContractValue<number>(
  ESCROW_MULTIBRIDGE_ADDRESS,
  'StarkWareProxy_upgradeDelay',
)

const starkgateManagerDelaySeconds = discovery.getContractValue<number>(
  'StarkgateManager',
  'StarkWareProxy_upgradeDelay',
)

const starkgateRegistryDelaySeconds = discovery.getContractValue<number>(
  'StarkgateRegistry',
  'StarkWareProxy_upgradeDelay',
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
  escrowMultibridgeDelaySeconds,
  starkgateManagerDelaySeconds,
  starkgateRegistryDelaySeconds,
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
    return `The current bridge cap is ${formatLargeNumber(
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
const escrowEKUBOMaxTotalBalanceString = formatMaxTotalBalanceString(
  'EKUBO',
  discovery.getContractValue<number>('MultiBridge', 'maxTotalBalance_EKUBO'),
  18,
)

const finalizationPeriod = 0

const proxyGovernors = getProxyGovernance(discovery, 'Starknet')
const governors = discovery.getPermissionedAccounts('Starknet', 'governors')

// big governance assert
assert(
  proxyGovernors[0].address ===
    discovery.getContract('StarknetAdminMultisig').address &&
    proxyGovernors[1].address ===
      discovery.getContract('StarknetSecurityCouncil').address &&
    proxyGovernors.length === 2 &&
    governors[0].address ===
      discovery.getContract('StarknetOpsMultisig').address &&
    governors[1].address ===
      discovery.getContract('StarknetSecurityCouncil').address &&
    governors.length === 2,
  'gov has changed, review non-discodriven perms and gov section.',
)

export const starknet: Layer2 = {
  type: 'layer2',
  id: ProjectId('starknet'),
  capability: 'universal',
  addedAt: new UnixTime(1642687633), // 2022-01-20T14:07:13Z
  display: {
    name: 'Starknet',
    slug: 'starknet',
    stack: 'SN Stack',
    description:
      'Starknet is a general purpose ZK Rollup based on STARKs and the Cairo VM.',
    purposes: ['Universal'],
    category: 'ZK Rollup',

    links: {
      apps: ['https://starkgate.starknet.io/'],
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
        'Starknet is a ZK rollup that posts state diffs to the L1. For a transaction to be considered final, the state diffs have to be submitted and validity proof should be generated, submitted, and verified. Proofs are aggregated with other projects using SHARP and state updates have to refer to proved claims.',
    },
    finality: {
      finalizationPeriod,
    },
    costsWarning: {
      sentiment: 'warning',
      value:
        'The proof verification costs are shared among all projects that use the Starkware SHARP verifier. Therefore, Starknet’s costs represent a rough estimate, and we are working to provide more accurate values.',
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
        upgradableBy: [
          {
            name: 'StarkGate ETH owner',
            delay: formatSeconds(escrowETHDelaySeconds),
          },
          {
            name: 'BridgeMultisig',
            delay: formatSeconds(escrowETHDelaySeconds),
          },
        ],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x0437465dfb5B79726e35F08559B0cBea55bb585C'),
        sinceTimestamp: new UnixTime(1652101033),
        tokens: ['DAI'],
        ...ESCROW.CANONICAL_EXTERNAL,
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
        upgradableBy: [
          {
            name: 'BridgeMultisig',
            delay: formatSeconds(escrowWBTCDelaySeconds),
          },
        ],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_USDC_ADDRESS),
        sinceTimestamp: new UnixTime(1657137639),
        tokens: ['USDC'],
        upgradableBy: [{ name: 'BridgeMultisig', delay: 'no' }],
        description:
          'StarkGate bridge for USDC.' + ' ' + escrowUSDCMaxTotalBalanceString,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_USDT_ADDRESS),
        sinceTimestamp: new UnixTime(1657137615),
        tokens: ['USDT'],
        description:
          'StarkGate bridge for USDT.' + ' ' + escrowUSDTMaxTotalBalanceString,
        upgradableBy: [
          {
            name: 'BridgeMultisig',
            delay: formatSeconds(escrowUSDTDelaySeconds),
          },
        ],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_WSTETH_ADDRESS),
        sinceTimestamp: new UnixTime(1657137623),
        tokens: ['wstETH'],
        description:
          'StarkGate bridge for wstETH.' +
          ' ' +
          escrowWSTETHMaxTotalBalanceString,
        upgradableBy: [
          {
            name: 'BridgeMultisig',
            delay: formatSeconds(escrowWSTETHDelaySeconds),
          },
        ],
        ...ESCROW.CANONICAL_EXTERNAL,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_RETH_ADDRESS),
        sinceTimestamp: new UnixTime(1657137623),
        tokens: ['rETH'],
        description:
          'StarkGate bridge for rETH.' + ' ' + escrowRETHMaxTotalBalanceString,
        upgradableBy: [
          {
            name: 'BridgeMultisig',
            delay: formatSeconds(escrowRETHDelaySeconds),
          },
        ],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_UNI_ADDRESS),
        tokens: ['UNI'],
        description:
          'StarkGate bridge for UNI.' + ' ' + escrowUNIMaxTotalBalanceString,
        upgradableBy: [
          {
            name: 'StarkGate UNI owner',
            delay: formatSeconds(escrowUNIDelaySeconds),
          },
        ],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_FRAX_ADDRESS),
        tokens: ['FRAX'],
        description:
          'StarkGate bridge for FRAX.' + ' ' + escrowFRAXMaxTotalBalanceString,
        upgradableBy: [
          {
            name: 'StarkGate FRAX owner',
            delay: formatSeconds(escrowFRAXDelaySeconds),
          },
        ],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_FXS_ADDRESS),
        tokens: ['FXS'],
        description:
          'StarkGate bridge for FXS.' + ' ' + escrowFXSMaxTotalBalanceString,
        upgradableBy: [
          {
            name: 'StarkGate FXS owner',
            delay: formatSeconds(escrowFXSDelaySeconds),
          },
        ],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_SFRXETH_ADDRESS),
        tokens: ['sfrxETH'],
        description:
          'StarkGate bridge for sfrxETH.' +
          ' ' +
          escrowSFRXETHMaxTotalBalanceString,
        upgradableBy: [
          {
            name: 'StarkGate sfrxETH owner',
            delay: formatSeconds(escrowSFRXETHDelaySeconds),
          },
        ],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_LUSD_ADDRESS),
        tokens: ['LUSD'],
        description:
          'StarkGate bridge for LUSD.' + ' ' + escrowLUSDMaxTotalBalanceString,
        upgradableBy: [
          {
            name: 'StarkGate LUSD owner',
            delay: formatSeconds(escrowLUSDDelaySeconds),
          },
        ],
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
        upgradableBy: [
          {
            name: 'BridgeMultisig',
            delay: formatSeconds(escrowSTRKDelaySeconds),
          },
        ],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress(ESCROW_MULTIBRIDGE_ADDRESS),
        tokens: ['EKUBO', 'ZEND', 'NSTR'],
        description:
          'StarkGate bridge for EKUBO, ZEND, NSTR (and potentially other tokens listed via StarkgateManager).' +
          ' ' +
          escrowEKUBOMaxTotalBalanceString,
        upgradableBy: [
          {
            name: 'StarkGate MultiBridge Admin',
            delay: formatSeconds(escrowMultibridgeDelaySeconds),
          },
        ],
      }),
    ],
    transactionApi: {
      type: 'starknet',
      defaultUrl: 'https://starknet-mainnet.public.blastapi.io',
      defaultCallsPerMinute: 120,
    },
    daTracking: [
      {
        type: 'ethereum',
        daLayer: ProjectId('ethereum'),
        sinceBlock: 0, // Edge Case: config added @ DA Module start
        inbox: '0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4',
        sequencers: [
          '0xFf6B2185E357b6e9136A1b2ca5d7C45765D5c591',
          '0x2C169DFe5fBbA12957Bdd0Ba47d9CEDbFE260CA7',
        ],
      },
    ],
    finality: {
      lag: 0,
      type: 'Starknet',
      minTimestamp: new UnixTime(1724856347),
      stateUpdate: 'disabled',
    },
    trackedTxs: [
      {
        uses: [
          { type: 'liveness', subtype: 'proofSubmissions' },
          { type: 'l2costs', subtype: 'proofSubmissions' },
        ],
        query: {
          formula: 'sharpSubmission',
          sinceTimestamp: new UnixTime(1636978914),
          untilTimestamp: new UnixTime(1702921247),
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
          sinceTimestamp: new UnixTime(1702921247),
          untilTimestamp: new UnixTime(1704855731),
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
          sinceTimestamp: new UnixTime(1704855731),
          untilTimestamp: new UnixTime(1710252995),
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
          sinceTimestamp: new UnixTime(1710252995),
          untilTimestamp: new UnixTime(1710625271),
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
          sinceTimestamp: new UnixTime(1710625271),
          untilTimestamp: new UnixTime(1715783986), // 15.05.2024 https://app.blocksec.com/explorer/tx/eth/0x3b5c41b3abb8e265b8d58ec3dde79790d4f0ee050de97f8bd0fe68048c070bdd
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
          sinceTimestamp: new UnixTime(1715783986),
          untilTimestamp: new UnixTime(1724856227),
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
          sinceTimestamp: new UnixTime(1724856227),
          untilTimestamp: new UnixTime(1732747391),
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
          sinceTimestamp: new UnixTime(1724856227),
          untilTimestamp: new UnixTime(1732747391),
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
          sinceTimestamp: new UnixTime(1732747391),
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
          sinceTimestamp: new UnixTime(1732747391),
          programHashes: [
            '15787695375210609250491147414005894154890873413229882671403677761527504080', // Aggregator (since Starknet v0.13.3)
          ],
        },
        _hackCostMultiplier: 0.05,
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
          sinceTimestamp: new UnixTime(1636979180),
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
          sinceTimestamp: new UnixTime(1710252995),
          untilTimestamp: new UnixTime(1724855579),
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
          sinceTimestamp: new UnixTime(1724855579),
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
          sinceTimestamp: new UnixTime(1678095635),
          untilTimestamp: new UnixTime(1706789063),
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
          sinceTimestamp: new UnixTime(1706789063),
          untilTimestamp: new UnixTime(1710342000),
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
          sinceTimestamp: new UnixTime(1710342000),
          untilTimestamp: new UnixTime(1722197315),
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
          sinceTimestamp: new UnixTime(1722197315),
          untilTimestamp: new UnixTime(1732747391),
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
          sinceTimestamp: new UnixTime(1722197315),
          untilTimestamp: new UnixTime(1732747391),
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
          sinceTimestamp: new UnixTime(1732747391),
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
          sinceTimestamp: new UnixTime(1732747391),
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
          sinceTimestamp: new UnixTime(1706772791),
          untilTimestamp: new UnixTime(1710342000),
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
          sinceTimestamp: new UnixTime(1710342000),
          untilTimestamp: new UnixTime(1715783986), //15.05.2024
        },
        _hackCostMultiplier: 0.65,
      },
      {
        uses: [{ type: 'l2costs', subtype: 'proofSubmissions' }], //same config as above but different multiplier
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0xDEf8A3b280A54eE7Ed4f72E1c7d6098ad8df44fb',
          ),
          selector: '0xe85a6a28',
          functionSignature:
            'function verifyFRI(uint256[] proof,uint256[] friQueue,uint256 evaluationPoint,uint256 friStepSize,uint256 expectedRoot)',
          sinceTimestamp: new UnixTime(1715783986), //15.05.2024
          untilTimestamp: new UnixTime(1722197315), //28.07.2024
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
          sinceTimestamp: new UnixTime(1722197315),
          untilTimestamp: new UnixTime(1732665600), //27.11
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
          sinceTimestamp: new UnixTime(1732665600),
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
          sinceTimestamp: new UnixTime(1706767355),
          untilTimestamp: new UnixTime(1710342000),
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
          sinceTimestamp: new UnixTime(1710342000),
          untilTimestamp: new UnixTime(1715783986),
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
          sinceTimestamp: new UnixTime(1715783986),
          untilTimestamp: new UnixTime(1722197315),
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
          sinceTimestamp: new UnixTime(1722197315),
          untilTimestamp: new UnixTime(1732665600), //27.11
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
          sinceTimestamp: new UnixTime(1732665600),
        },
        _hackCostMultiplier: 0.05,
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
      secondLine: formatExecutionDelay(finalizationPeriod),
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN_STATE_DIFFS,
    },
    exitWindow: RISK_VIEW.EXIT_WINDOW(minDelay, 0),
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM(),
    proposerFailure: RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
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
          title: 'What is Starknet',
          url: 'https://starkware.co/starknet/',
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
    compressionScheme: "Starknet doesn't use any compression scheme.",
    genesisState: 'There is no non-empty genesis state.',
    dataFormat:
      'The data format has been updated with different versions, and the full specification can be found [here](https://docs.starknet.io/documentation/architecture_and_concepts/Network_Architecture/on-chain-data/).',
  },
  stateValidation: {
    description:
      'Each update to the system state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Ethereum by a smart contract.',
    categories: [
      {
        title: 'Proven Program',
        description:
          'The source code of the Starknet OS can be found [here](https://github.com/starkware-libs/cairo-lang/tree/v0.13.1/src/starkware/starknet/core/os). The source code of the bootloader can be found [here](https://github.com/starkware-libs/cairo-lang/blob/v0.13.1/src/starkware/cairo/bootloaders/bootloader/bootloader.cairo).',
        risks: [],
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
  contracts: {
    addresses: {
      [discovery.chain]: [
        discovery.getContractDetails('Starknet', {
          description:
            'Starknet contract receives (verified) state roots from the Sequencer, allows users to read L2 -> L1 messages and send L1 -> L2 message.',
          upgradableBy: [
            {
              name: 'StarknetAdminMultisig',
              delay: starknetDelaySeconds
                ? formatSeconds(starknetDelaySeconds)
                : 'No delay',
            },
            {
              name: 'StarknetSecurityCouncil',
              delay: starknetDelaySeconds
                ? formatSeconds(starknetDelaySeconds)
                : 'No delay',
            },
          ],
        }),
        ...getSHARPVerifierContracts(discovery, verifierAddress),
        discovery.getContractDetails(
          'L1DaiGateway',
          'Custom DAI Gateway, main entry point for users depositing DAI to L2 where "canonical" L2 DAI token managed by MakerDAO will be minted. Managed by MakerDAO.',
        ),
        discovery.getContractDetails('StarkgateManager', {
          description:
            'This contract allows the permissionless creation and configuration of StarkGate token escrows. Tokens can also be blacklisted for creation, and already actively bridged tokens can be deactivated from depositing by a designated TokenAdmin.',
          upgradableBy: [
            {
              name: 'StarkgateBridgeMultisig',
              delay: formatSeconds(starkgateManagerDelaySeconds),
            },
          ],
        }),
        discovery.getContractDetails('StarkgateRegistry', {
          description:
            'A central registry contract to map token addresses to their StarkGate bridge contract.',
          upgradableBy: [
            {
              name: 'StarkgateBridgeMultisig',
              delay: formatSeconds(starkgateRegistryDelaySeconds),
            },
          ],
        }),
      ],
    },
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_SECONDS_RISK(minDelay)],
  },
  upgradesAndGovernance: `
  The Starknet ZK Rollup shares its SHARP verifier with other StarkEx and SN Stack Layer 2s. Governance of the system is currently split between three major Multisig admins with instant upgrade capability and one ops Multisig that can tweak central configurations.


  The ${discovery.getMultisigStats('StarknetAdminMultisig')} StarknetAdminMultisig can upgrade the Starknet contract, while the ${discovery.getMultisigStats('StarknetOpsMultisig')} StarknetOpsMultisig is permissioned to tweak its configuration. Starkgate bridge contracts can be upgraded (and configured) by the StarknetEscrowMultisig without delay.


  The shared SHARPVerifier contract is governed by the ${discovery.getMultisigStats('SHARPVerifierAdminMultisig')} SHARPVerifierAdminMultisig, who can upgrade it without delay, affecting all StarkEx and SN stack chains that are using it.
  `,
  permissions: {
    [discovery.chain]: {
      actors: [
        discovery.getMultisigPermission(
          'StarknetSecurityCouncil',
          'Can upgrade the central Starknet constract, potentially potentially allowing fraudulent state to be posted and gaining access to all funds stored in the bridge. Can also appoint operators, change the programHash, configHash, or message cancellation delay without upgrading the contract.' +
            delayDescriptionFromSeconds(starknetDelaySeconds),
        ),
        discovery.getMultisigPermission(
          'StarknetAdminMultisig',
          'Can upgrade the central Starknet constract, potentially potentially allowing fraudulent state to be posted and gaining access to all funds stored in the bridge.' +
            delayDescriptionFromSeconds(starknetDelaySeconds),
        ),
        ...getSHARPVerifierGovernors(discovery, verifierAddress),
        discovery.getMultisigPermission(
          'StarkgateBridgeMultisig',
          'Can upgrade most of the Starkgate bridge escrows including the Starkgate Multibridge. Can also configure the flowlimits of the existing Starkgate escrows or add new deployments.',
        ),
        discovery.getMultisigPermission(
          'StarknetOpsMultisig',
          'Can appoint operators, change the programHash, configHash, or message cancellation delay.',
        ),
        discovery.getPermissionDetails(
          'Operators',
          discovery.getPermissionedAccounts('Starknet', 'operators'),
          'Allowed to post state updates. When the operator is down the state cannot be updated.',
        ),
        discovery.getMultisigPermission(
          'StarknetOpsMultisig',
          'Can appoint operators, change the programHash, configHash, or message cancellation delay.',
        ),
        discovery.getMultisigPermission(
          'StarkgateSecurityAgentMultisig',
          'Can enable withdrawal limits for tokens in some Starkgate bridge Escrows.',
        ),
        discovery.getPermissionDetails(
          'StarkGate LUSD owner',
          getProxyGovernance(discovery, ESCROW_LUSD_ADDRESS),
          'Can upgrade implementation of the LUSD escrow, potentially gaining access to all funds stored in the bridge. ' +
            delayDescriptionFromSeconds(escrowLUSDDelaySeconds),
        ),
        discovery.getPermissionDetails(
          'StarkGate token blacklister EOA',
          discovery.getAccessControlRolePermission(
            'StarkgateManager',
            'TOKEN_ADMIN',
          ),
          'Can remove and blacklist tokens from the Starkgate bridge.',
        ),
      ],
    },
  },
  milestones: [
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
  badges: [
    Badge.VM.CairoVM,
    Badge.DA.EthereumBlobs,
    Badge.Stack.SNStack,
    Badge.Infra.SHARP,
    Badge.Other.Governance,
  ],
  knowledgeNuggets: [...NUGGETS.STARKWARE],
}
