import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { formatEther } from 'ethers/lib/utils'
import { CROP_NOTES } from '../../common/crops'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { PRIVACY_CATEGORIES } from '../../common/privacyCategories'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import {
  getTokenByAddress,
  getTokenBySymbol,
} from '../../tokens/getTokenByAddress'
import type { BaseProject, ProjectPrivacyToken } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'
import { umbraAdversaries } from './adversaries'

const discovery = new ProjectDiscovery('umbra')

const UMBRA_ANNOUNCEMENT_EVENT =
  '0x29877766fa2bfe3b90008d6d92f965eca91cbc5757ed775740e460799fb92219'
const UMBRA_TOKEN_WITHDRAWAL_EVENT =
  '0x30eb3583ad09933b693a45452ab07512244cdbc5868701aa004c27b7b267c249'
const STEALTH_KEY_CHANGED_EVENT =
  '0xe879dede910dd3b22239a11044df83c95adcd4b54003516f42866cc1fe4f0a19'

const ETH_TOKEN_PLACEHOLDER = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

/** A tracked token, by symbol, with an address when the symbol is ambiguous on the chain. */
type UmbraTokenRef = string | { symbol: string; address: string }

interface UmbraDeployment {
  chain: string
  chainId: number
  tokens: UmbraTokenRef[]
}

// Umbra uses the same addresses on every chain. A chain is tracked when its
// registry saw at least 500 distinct registrants in the trailing twelve
// months. Counted with eth_getLogs on 2026-11-02: Ethereum qualifies, Base
// (295), Polygon PoS (143), Arbitrum (113) and Optimism (28) do not, so those
// deployments are shown without statistics.
const DEPLOYMENTS: UmbraDeployment[] = [
  {
    chain: 'ethereum',
    chainId: 1,
    tokens: ['DAI', 'ETH', 'USDC', 'USDT', 'WBTC'],
  },
]

const UNTRACKED_DEPLOYMENTS = ['optimism', 'polygonpos', 'base', 'arbitrum']

const umbraCore = discovery.getContract('Umbra', 'ethereum')
const stealthKeyRegistry = discovery.getContract(
  'StealthKeyRegistry',
  'ethereum',
)

const privacyTokens: ProjectPrivacyToken[] = DEPLOYMENTS.flatMap(
  (deployment) => {
    const core = discovery.getContract('Umbra', deployment.chain)
    return deployment.tokens.map((ref) => {
      const resolved =
        typeof ref === 'string'
          ? getTokenBySymbol(ref, deployment.chainId)
          : getTokenByAddress(ref.address, deployment.chainId)
      const address = EthereumAddress(resolved.address ?? ETH_TOKEN_PLACEHOLDER)
      const isNative = resolved.address === undefined
      // Prices must cover the whole bucket range, so never start before listing.
      const sinceTimestamp = Math.max(
        core.sinceTimestamp ?? 0,
        resolved.coingeckoListingTimestamp,
      )
      const bucketId =
        deployment.chain === 'ethereum'
          ? `umbra-${resolved.symbol}`
          : `umbra-${deployment.chain}-${resolved.symbol}`

      return {
        token: {
          chain: deployment.chain,
          address,
          iconUrl: resolved.iconUrl,
          symbol: resolved.symbol,
          decimals: resolved.decimals,
          priceId: resolved.coingeckoId,
          sinceTimestamp,
        },
        buckets: [
          {
            id: bucketId,
            type: 'pool',
            label: resolved.symbol,
            address: core.address,
            sinceTimestamp,
            deposit: {
              event: UMBRA_ANNOUNCEMENT_EVENT,
              extractor: 'umbraAmount',
              params: { tokenAddress: address },
            },
            withdrawal: {
              // ETH is forwarded straight to the stealth address instead of
              // being escrowed, so its Announcement is a deposit and a
              // withdrawal at once.
              event: isNative
                ? UMBRA_ANNOUNCEMENT_EVENT
                : UMBRA_TOKEN_WITHDRAWAL_EVENT,
              extractor: 'umbraAmount',
              params: { tokenAddress: address },
            },
          },
        ],
      }
    })
  },
)

export const umbra: BaseProject = {
  id: ProjectId('umbra'),
  slug: 'umbra',
  name: 'Umbra Cash',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2026-07-31')),
  discoveryInfo: getDiscoveryInfo([discovery]),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'A stealth-address payment protocol for an existing wallet on Ethereum and several L2s: the user registers once, and anyone can pay them at a fresh address.',
    detailedDescription: readProjectMarkdown('umbra', 'detailedDescription', {
      toll: `${Number(formatEther(discovery.getContractValue<number>(umbraCore.address, 'toll')))} ETH`,
    }),
    links: {
      websites: ['https://app.umbra.cash'],
      documentation: ['https://app.umbra.cash/faq'],
      repositories: ['https://github.com/ScopeLift/umbra-protocol'],
      socialMedia: [
        'https://x.com/UmbraCash',
        'https://discord.com/invite/uw4y5J2p7C',
      ],
      other: [
        'https://diligence.security/audits/2021/03/umbra-smart-contracts/',
      ],
    },
    badges: [],
  },
  privacyInfo: {
    category: PRIVACY_CATEGORIES.stealthAddress,
    referenceApp: {
      name: 'Umbra app',
      url: 'https://app.umbra.cash',
      since: '2026-09-16',
      source: {
        repository: 'https://github.com/ScopeLift/umbra-protocol',
        commit: '947c4f3b9b89f6cf5d69b2d43d3cffec673da655',
      },
    },
    deployedOn: [
      ...DEPLOYMENTS.map((deployment) => deployment.chain),
      ...UNTRACKED_DEPLOYMENTS,
    ],
    trackedOn: DEPLOYMENTS.map((deployment) => deployment.chain),
    tokens: privacyTokens,
    anonymitySet: {
      type: 'key-registrations',
      registry: stealthKeyRegistry.address,
      sinceTimestamp: UnixTime(stealthKeyRegistry.sinceTimestamp ?? 0),
      event: STEALTH_KEY_CHANGED_EVENT,
      extractor: 'umbraStealthKeyChanged',
    },
    exitWindow: {
      value: 'Infinite',
      sentiment: 'good',
      orderHint: Number.MAX_SAFE_INTEGER,
      description:
        'The contracts are immutable. The toll applies only to new payments, so recipients can always withdraw what they received.',
      walkawayTest: { passed: true },
    },
    reproducibility: {
      value: 'Reproducible',
      sentiment: 'good',
      description:
        'The contracts, the umbra-js library and the frontend are open source and build locally. The indexer and the relayer API behind the hosted app are closed.',
    },
    attributes: [
      PRIVACY_ATTRIBUTES.anyAmount,
      PRIVACY_ATTRIBUTES.stealthAddresses,
    ],
    adversaries: umbraAdversaries(
      discovery.getContractValue<number>(
        stealthKeyRegistry.address,
        'registeredAddresses',
      ),
    ),
    riskSummary: readProjectMarkdown('umbra', 'riskSummary'),
    upgradesAndGovernance: {
      content: readProjectMarkdown('umbra', 'upgradesAndGovernance'),
    },
  },
  crops: {
    censorshipResistance: {
      sentiment: 'good',
      points: [
        CROP_NOTES.infiniteExitWindow,
        CROP_NOTES.passesWalkawayTest(
          'nobody can stop a recipient from claiming a payment already sent to them, and withdrawals can always be self-relayed.',
        ),
        'The contracts censor nobody - the owner can only raise the ETH toll on contract-routed payments, which applies to everyone equally. The hosted app refuses sanctioned and blocklisted addresses.',
      ],
      missing: [
        'ERC-20 stealth transfers are currently relayed only by Umbra Cash relayer, privacy guarantees are weakened if it censors withdrawals.',
      ],
    },
    openSource: {
      sentiment: 'good',
      license: 'MIT',
      points: [
        'The immutable core contracts, the cryptographic library and the frontend are published and can be built and run locally.',
      ],
    },
    privacy: {
      sentiment: 'warning',
      points: [
        'Recipient privacy with no protocol-level compliance mechanism and no privileged view key.',
      ],
      missing: [
        'Only who controls the receiving address is hidden - the sender, the amount and the stealth address stay public.',
        "The hosted app sends the operator the user's wallet address and withdrawal addresses in one session.",
      ],
    },
    security: {
      sentiment: 'good',
      points: [
        'A small, immutable, externally audited contract set with no proof system and no trusted setup.',
      ],
    },
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
