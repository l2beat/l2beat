import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { CROP_NOTES } from '../../common/crops'
import { PRIVACY_ANONYMITY_SET_MINIMUM_AMOUNTS } from '../../common/privacyAnonymitySets'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { PRIVACY_CATEGORIES } from '../../common/privacyCategories'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { getTokenByAddress } from '../../tokens/getTokenByAddress'
import type { BaseProject, ProjectPrivacyToken } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'
import {
  REFERENCE_APP,
  REFERENCE_PAGE,
  TACIT_COMMIT,
  TACIT_REPOSITORY,
  tacitPayAdversaries,
} from './adversaries'

const discovery = new ProjectDiscovery('tacit-pay')

const ETH = EthereumAddress('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
// TacitEvmPool's one event for deposits, transfers and withdrawals.
const TRANSACT_EVENT =
  '0xdf0ed29e998ac2f2ff0f0516cb9c1b95af189e00d55af3764b95bdd2a835e53a'

const POOL = discovery.getContract('TacitEvmPool')
const VERIFIER = discovery.getContract('TransactVerifier')
assert(POOL.sinceTimestamp !== undefined, 'The pool must have a sinceTimestamp')
const SINCE_TIMESTAMP = UnixTime(POOL.sinceTimestamp)

assert(
  discovery.getContractValue<string>('TacitEvmPool', 'ASSET') ===
    'eth:0x0000000000000000000000000000000000000000',
  'The pool must hold native ETH',
)
assert(
  discovery.getContractValue<string>('TacitEvmPool', 'VERIFIER') ===
    VERIFIER.address,
  'The pool must verify with the TransactVerifier',
)
assert(
  discovery.getContractValue<string>('TacitEvmPoolRouter', 'POOL') ===
    POOL.address,
  'The router must be bound to the pool',
)
// The ratings assume this page. A new name target needs a new review.
assert(
  discovery.getContractValue<string>('TacitPay8244', 'anonWeiTarget') ===
    REFERENCE_PAGE,
  'anon.wei must resolve to the reviewed page',
)

export const tacitPay: BaseProject = {
  id: ProjectId('tacit-pay'),
  slug: 'tacit-pay',
  name: 'Tacit Pay',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2026-11-09')),
  discoveryInfo: getDiscoveryInfo([discovery]),
  ossificationHistory: discovery.getOssificationHistory(SINCE_TIMESTAMP),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'A shielded ledger for ETH with private transfers, proven in the browser, with immutable contracts and an app stored on Ethereum.',
    detailedDescription: readProjectMarkdown(
      'tacit-pay',
      'detailedDescription',
    ),
    links: {
      websites: ['https://tacit.finance'],
      documentation: [`${TACIT_REPOSITORY}/blob/main/docs/EVM-POOL.md`],
      repositories: [TACIT_REPOSITORY, 'https://github.com/ERC8244/dapps'],
    },
    badges: [],
  },
  milestones: [
    {
      // The anon.wei page went onchain as generation 1 (0x1e01D6…) on
      // 2026-10-03, ERC8244/dapps commit 66f517fa "the deployment is
      // recorded". The reviewed generation 6 followed on 2026-10-27.
      title: 'anon.wei app stored onchain',
      url: 'https://github.com/ERC8244/dapps/blob/bf39cc0b4d8c5eabdcd76f8b0672ec97b645a986/tacit-pay/deploy/TACIT-PAY-8244.deployed.md',
      date: '2026-10-03T00:00:00Z',
      description:
        'The reference app is published as contract code on Ethereum, each version immutable.',
      type: 'general',
    },
    {
      // Pool deployed in block 26069245, 2026-09-27 13:58:59 UTC, about
      // 1.7 hours after the ceremony's Bitcoin beacon (block 968840).
      // contracts/deployments/evm-pool.json lists the transactions.
      title: 'Tacit Pay pool launch',
      url: `${TACIT_REPOSITORY}/blob/${TACIT_COMMIT}/contracts/deployments/evm-pool.json`,
      date: '2026-09-27T00:00:00Z',
      description:
        'The ETH pool, router and verifier go live with the ceremony key and no owner.',
      type: 'general',
    },
  ],
  escrows: [
    {
      address: ChainSpecificAddress.address(POOL.address),
      chain: ChainSpecificAddress.longChain(POOL.address),
      sinceTimestamp: SINCE_TIMESTAMP,
      tokens: ['ETH'],
    },
  ],
  tvsInfo: {
    associatedTokens: [],
    warnings: [],
  },
  zkCatalogInfo: {
    creator: 'Tacit',
    techStack: {
      zkVM: [ZK_CATALOG_TAGS.curve.BN254, ZK_CATALOG_TAGS.Groth16.Snarkjs],
    },
    proofSystemInfo: '',
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        ...TRUSTED_SETUPS.TacitPay,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('tacit-pay'),
        sinceTimestamp: SINCE_TIMESTAMP,
      },
    ],
    verifierHashes: [
      {
        hash: 'Tacit Pay transact verifier 27.09.2026',
        name: 'Transact verifier',
        sourceLink: `${TACIT_REPOSITORY}/tree/${TACIT_COMMIT}/dapp/circuits/evm-pool`,
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        knownDeployments: [{ address: VERIFIER.address }],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'tacit-pay',
          'verificationSteps-09.11.2026',
        ),
      },
    ],
  },
  privacyInfo: {
    category: PRIVACY_CATEGORIES.shieldedLedger,
    referenceApp: REFERENCE_APP,
    trackedOn: ['ethereum'],
    // Chains with the same contracts and a released app: anon.wei serves Base
    // and Robinhood Chain, tacit.finance/pay/eth also MegaETH.
    runsOn: [ProjectId('base'), ProjectId('robinhood'), ProjectId('megaeth')],
    tokens: [getPrivacyToken()],
    relayerTracking: {
      type: 'onchainEvents',
      sources: [
        {
          address: POOL.address,
          sinceTimestamp: SINCE_TIMESTAMP,
          extractor: 'tacitPayWithdrawal',
        },
      ],
    },
    exitWindow: {
      value: 'Infinite',
      sentiment: 'good',
      orderHint: Number.MAX_SAFE_INTEGER,
      description:
        'The pool, its router and verifier are immutable and cannot be paused, so users can always withdraw with a valid proof.',
      walkawayTest: { passed: true },
    },
    reproducibility: {
      value: 'Reproducible',
      sentiment: 'good',
      description:
        'The contracts, circuit, app and relay are public under MIT, and every contract is verified. The verifier rebuilds from the circuit and the ceremony key, and the deployed app rebuilds byte for byte from its readable source.',
    },
    attributes: [
      PRIVACY_ATTRIBUTES.zk,
      PRIVACY_ATTRIBUTES.transfers,
      PRIVACY_ATTRIBUTES.anyAmount,
    ],
    adversaries: tacitPayAdversaries,
    riskSummary: readProjectMarkdown('tacit-pay', 'riskSummary'),
    upgradesAndGovernance: {
      content: readProjectMarkdown('tacit-pay', 'upgradesAndGovernance'),
    },
  },
  crops: {
    censorshipResistance: {
      sentiment: 'good',
      points: [
        CROP_NOTES.infiniteExitWindow,
        'Anyone can deposit, transfer and withdraw. Any account can submit a proof, and the proof fixes its recipient, amount and fee.',
        CROP_NOTES.passesWalkawayTest(
          'the app lives on Ethereum, the proving files in the public repository, and users can send their own spends.',
        ),
      ],
      missing: [
        "A private exit without Tacit's relay needs another relay, and none runs today.",
      ],
      additionalConsiderations: [
        'This evaluation covers Ethereum. The same contracts run on Base, Robinhood Chain and MegaETH, where the chain decides whether a withdrawal can be forced in.',
      ],
    },
    openSource: {
      sentiment: 'good',
      license: 'MIT',
      points: [
        'The contracts, circuit, app and relay are published and build locally.',
        'Every contract is verified, the verifier rebuilds from the circuit and the ceremony key, and the app rebuilds from its source.',
      ],
    },
    privacy: {
      sentiment: 'warning',
      points: [
        'Privacy is unconditional: nothing screens users, only the user holds viewing keys, and proofs are made on the device.',
      ],
      missing: [
        'Fewer than 50 wallets have deposited, apart from wallets that only send funds back to themselves, so timing and amounts can pair the two ends.',
        "Tacit's relay, the default, sees the recipient of every exit with the user's IP.",
      ],
    },
    security: {
      sentiment: 'bad',
      points: [
        'The pool, router and verifier are immutable and have no owner.',
      ],
      missing: [
        'One party could have made all 176 trusted setup contributions, which allow repeats under self-made keys, and could then forge proofs to drain the pool.',
        'No audit covers the pool, its router or its circuit.',
        'No circuit breaker or limit caps what a forged proof could take.',
      ],
    },
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
    zkVerifiers: [VERIFIER.address],
  },
}

function getPrivacyToken(): ProjectPrivacyToken {
  const token = getTokenByAddress(ETH.toString())
  const minimumAmounts = PRIVACY_ANONYMITY_SET_MINIMUM_AMOUNTS[token.symbol]
  assert(minimumAmounts, 'Missing anonymity set thresholds', {
    symbol: token.symbol,
  })
  return {
    token: {
      address: ETH,
      iconUrl: token.iconUrl,
      symbol: token.symbol,
      decimals: token.decimals,
      priceId: token.coingeckoId,
      sinceTimestamp: SINCE_TIMESTAMP,
    },
    buckets: [
      {
        id: 'tacit-pay-ETH',
        type: 'pool',
        label: token.symbol,
        address: POOL.address,
        sinceTimestamp: SINCE_TIMESTAMP,
        anonymitySet: { minimumAmounts },
        deposit: {
          event: TRANSACT_EVENT,
          extractor: 'tacitPayDeposit',
          params: {},
        },
        withdrawal: {
          event: TRANSACT_EVENT,
          extractor: 'tacitPayWithdrawal',
          params: {},
        },
      },
    ],
  }
}
