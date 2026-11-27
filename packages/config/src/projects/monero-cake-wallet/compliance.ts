import { definePrivacyCompliance } from '../../common/privacyCompliance'

// v0.18.5.1
const MONERO =
  'https://github.com/monero-project/monero/blob/4f92268d7c16741cfb41e5bbe2aa46cc260a9ea5/'

export const moneroCakeWalletCompliance = definePrivacyCompliance({
  description:
    'Monero itself has no screening, and Cake Wallet holds no keys or lists. The swap services Cake Wallet uses to exchange XMR can freeze a deposit automatically and hold it for identity and compliance checks, as [ChangeNOW documents](https://changenow.io/faq/kyc-aml).',
  disclosure: {
    level: 1,
    text: 'Cake Wallet shows a transaction key that proves one payment to one address on any Monero explorer.',
    verifiableWithoutOperator: true,
    singleVerifier: true,
    sources: [
      {
        title: 'Prove a Monero payment',
        url: 'https://docs.cakewallet.com/tutorials/prove-a-monero-payment',
        checked: '2026-11-27',
      },
    ],
  },
  powers: [
    {
      ladder: 'privacy',
      rung: 1,
      text: "Monero has no operator, and Cake holds no keys or lists, so neither can refuse or view a user's XMR.",
      sources: [
        {
          title: 'Every input names 16 ring members',
          url: MONERO + 'src/cryptonote_core/blockchain.cpp#L3268',
        },
        {
          title: 'Amounts are encrypted to the recipient',
          url: MONERO + 'src/ringct/rctOps.cpp#L672-L720',
        },
        { section: 'upgrades-and-governance' },
      ],
    },
    {
      ladder: 'funds',
      rung: 3,
      text: "Swap services on Cake's path, such as ChangeNOW, can hold a deposit for identity and compliance checks.",
      sources: [
        {
          title: 'ChangeNOW: automated AML holds, KYC through SumSub',
          url: 'https://changenow.io/faq/kyc-aml',
          checked: '2026-11-27',
        },
      ],
    },
  ],
})
