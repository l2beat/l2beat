import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { getTokenByAddress } from '../../tokens/getTokenByAddress'
import type { BaseProject, ProjectPrivacyToken } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('umbra')

const UMBRA_ANNOUNCEMENT_EVENT =
  '0x29877766fa2bfe3b90008d6d92f965eca91cbc5757ed775740e460799fb92219'
const UMBRA_TOKEN_WITHDRAWAL_EVENT =
  '0x30eb3583ad09933b693a45452ab07512244cdbc5868701aa004c27b7b267c249'

const ETH_TOKEN_PLACEHOLDER = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

const TRACKED_TOKENS = [
  '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
  ETH_TOKEN_PLACEHOLDER,
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
]

const umbraCore = discovery.getContract('Umbra')

const privacyTokens: ProjectPrivacyToken[] = TRACKED_TOKENS.map((address) => {
  const resolved = getTokenByAddress(address)
  // Prices must cover the whole bucket range, so never start before listing.
  const sinceTimestamp = Math.max(
    umbraCore.sinceTimestamp ?? 0,
    resolved.coingeckoListingTimestamp,
  )

  return {
    token: {
      address: EthereumAddress(address),
      iconUrl: resolved.iconUrl,
      symbol: resolved.symbol,
      decimals: resolved.decimals,
      priceId: resolved.coingeckoId,
      sinceTimestamp,
    },
    buckets: [
      {
        id: `umbra-${resolved.symbol}`,
        type: 'pool',
        label: resolved.symbol,
        address: umbraCore.address,
        sinceTimestamp,
        deposit: {
          event: UMBRA_ANNOUNCEMENT_EVENT,
          extractor: 'umbraAmount',
          params: { tokenAddress: EthereumAddress(address) },
        },
        withdrawal: {
          // ETH is forwarded straight to the stealth address instead of being
          // escrowed, so its Announcement is a deposit and a withdrawal at once.
          event:
            address === ETH_TOKEN_PLACEHOLDER
              ? UMBRA_ANNOUNCEMENT_EVENT
              : UMBRA_TOKEN_WITHDRAWAL_EVENT,
          extractor: 'umbraAmount',
          params: { tokenAddress: EthereumAddress(address) },
        },
      },
    ],
  }
})

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
      'A stealth-address payment protocol that hides the recipient behind a fresh address for every transfer.',
    detailedDescription: readProjectMarkdown('umbra', 'detailedDescription'),
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
    tokens: privacyTokens,
    summaryTrackedItemName: 'token',
    exitWindow: {
      value: 'Infinite',
      sentiment: 'good',
      orderHint: Number.MAX_SAFE_INTEGER,
      description:
        'The core contracts are immutable. The owner can change the toll for future payments, but cannot stop recipients from accessing payments that have already been sent.',
      walkawayTest: { passed: true },
    },
    reproducibility: {
      value: 'Reproducible',
      sentiment: 'good',
      description:
        'The immutable core contracts, cryptographic library, and frontend are published and can be built and run locally.',
    },
    privacy: {
      value: 'Recipient privacy',
      sentiment: 'good',
      description:
        'There is no protocol-level compliance mechanism or privileged view key. Umbra hides who controls the receiving address, but the sender, amount, and stealth address remain public and privacy can be weakened by transaction patterns or poor withdrawal hygiene.',
    },
    attributes: [
      PRIVACY_ATTRIBUTES.anyAmount,
      PRIVACY_ATTRIBUTES.stealthAddresses,
    ],
    riskSummary: readProjectMarkdown('umbra', 'riskSummary'),
    upgradesAndGovernance: {
      content: readProjectMarkdown('umbra', 'upgradesAndGovernance'),
    },
  },
  crops: {
    censorshipResistance: {
      sentiment: 'good',
      points: [
        'The core contracts are immutable, cannot be paused, and have no upgrade path, so the exit window is infinite.',
        'Passes the walkaway test: nobody can stop a recipient from claiming a payment already sent to them, and withdrawals can always be self-relayed.',
        'Nobody can censor an individual user - the owner can only raise the ETH toll on contract-routed payments, which applies to everyone equally and cannot touch payment or withdrawal logic.',
      ],
      notReviewed: ['Relayer set size and independence.'],
    },
    openSource: {
      sentiment: 'good',
      points: [
        'The immutable core contracts, the cryptographic library and the frontend are published and can be built and run locally.',
      ],
      notReviewed: ['License permissiveness, so fork rights are unconfirmed.'],
    },
    privacy: {
      sentiment: 'good',
      points: [
        'Recipient privacy with no protocol-level compliance mechanism, no privileged view key, and no way for anyone to retroactively deanonymize a payment.',
      ],
      missing: [
        'Only who controls the receiving address is hidden - the sender, the amount and the stealth address stay public.',
        'Privacy still depends on the recipient practising good withdrawal hygiene and avoiding recognizable timing or amount patterns.',
      ],
      notReviewed: ['Anonymity set size.'],
    },
    security: {
      sentiment: 'good',
      status: 'partiallyReviewed',
      points: [
        'A small, immutable, externally audited contract set with no proof system and no trusted setup.',
      ],
      missing: [
        'Stealth addresses rely on elliptic-curve key agreement, so they are not quantum-resistant.',
        'Immutability means the unsupported-token accounting caveat cannot be patched.',
      ],
      notReviewed: ['Monitoring, circuit breakers and rate limits.'],
    },
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}
