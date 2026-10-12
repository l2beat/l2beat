import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { PRIVACY_CATEGORIES } from '../../common/privacyCategories'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'
import { moneroCakeWalletAdversaries } from './adversaries'

export const moneroCakeWallet: BaseProject = {
  id: ProjectId('monero-cake-wallet'),
  slug: 'monero-cake-wallet',
  name: 'Monero via Cake Wallet',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2026-09-24')),
  statuses: {
    yellowWarning:
      'This route has no Ethereum contracts. Real-time monitoring is not supported.',
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      "A round trip from Ethereum into Monero and back through the swap screen of Cake Wallet, which hands each leg to a centralized instant exchange. Monero's ledger serves as the privacy pool.",
    detailedDescription: readProjectMarkdown(
      'monero-cake-wallet',
      'detailedDescription',
    ),
    links: {
      websites: ['https://cakewallet.com', 'https://www.getmonero.org'],
      documentation: [
        'https://docs.cakewallet.com/features/basic/swap',
        'https://docs.cakewallet.com/support/swap',
        'https://docs.cakewallet.com/features/privacy-and-security/privacy-settings',
        'https://www.getmonero.org/library/Zero-to-Monero-2-0-0.pdf',
      ],
      explorers: [],
      repositories: [
        'https://github.com/cake-tech/cake_wallet',
        'https://github.com/monero-project/monero',
      ],
      socialMedia: ['https://x.com/cakewallet', 'https://x.com/monero'],
      other: [
        'https://github.com/cake-tech/cake_wallet/blob/main/PRIVACY.md',
        'https://changenow.io/faq/kyc-aml',
        'https://kycnot.me/service/trocador',
      ],
    },
    badges: [],
  },
  privacyInfo: {
    category: PRIVACY_CATEGORIES.shieldedLedger,
    trackedOn: ['ethereum'],
    tokens: [],
    anonymitySet: {
      type: 'not-applicable',
      description:
        'Each Monero spend hides among the 16 members of its ring, and each self-transfer multiplies the candidates by about 30.',
    },
    exitWindow: {
      value: 'None',
      sentiment: 'bad',
      orderHint: 0,
      description:
        'Funds in transit sit with the swap service, which can steal them.',
      walkawayTest: {
        passed: false,
        reason:
          'Deposit and payout both depend on the swap service. If it stops, funds in transit are lost or refunded at its discretion.',
      },
    },
    reproducibility: {
      value: 'Partially reproducible',
      sentiment: 'warning',
      description:
        'Cake Wallet and Monero are open source. The swap services run closed systems.',
    },
    attributes: [
      PRIVACY_ATTRIBUTES.bridged,
      PRIVACY_ATTRIBUTES.transfers,
      PRIVACY_ATTRIBUTES.anyAmount,
    ],
    adversaries: moneroCakeWalletAdversaries,
    riskSummary: readProjectMarkdown('monero-cake-wallet', 'riskSummary'),
    upgradesAndGovernance: {
      content: readProjectMarkdown(
        'monero-cake-wallet',
        'upgradesAndGovernance',
      ),
    },
  },
}
