import { definePrivacyCompliance } from '../../common/privacyCompliance'

const TERMS = {
  title: '1Click terms: screening, delays, blocks and freezes',
  url: 'https://docs.near-intents.org/security-compliance/terms-of-service',
  checked: '2026-11-27',
}
const FORCE_LOCK = {
  title: 'Any account can be locked by the multisig or a locker',
  url: 'https://github.com/near/intents/blob/fa44ede9e874931c39a6c4246de82bc40f4f8d99/defuse/src/contract/accounts/force.rs#L19-L33',
}

export const zcashNearIntentsCompliance = definePrivacyCompliance({
  description:
    'Intents Technology Ltd. (British Virgin Islands) screens every quote against the NEAR Intents AML portal, Binance AML, AMLBot, PureFi and TRM Labs. Its [terms](https://docs.near-intents.org/security-compliance/terms-of-service) let it delay, block or freeze bridged funds and collect IP and wallet addresses. Market makers pass KYB, end users swap without an account.',
  disclosure: {
    level: 5,
    text: "Vizor exports a viewing key that reveals the account's whole past and future activity and cannot be revoked.",
    verifiableWithoutOperator: true,
    singleVerifier: true,
    sources: [
      {
        title: 'Vizor v0.0.61 release notes',
        url: 'https://github.com/chainapsis/vizor-wallet/blob/release/v0.0.66/release_notes/v0.0.61.md',
        checked: '2026-11-27',
      },
    ],
  },
  powers: [
    {
      ladder: 'privacy',
      rung: 3,
      text: 'The operator, Intents Technology, can hold the swap back to Ethereum and set the terms of its release.',
      sources: [TERMS, FORCE_LOCK],
    },
    {
      ladder: 'privacy',
      rung: 2,
      text: 'The operator, Intents Technology, screens every quote with five AML providers and can refuse it.',
      sources: [TERMS],
    },
    {
      ladder: 'funds',
      rung: 4,
      text: 'The NEAR Intents multisig or a single-key locker can freeze any account, and seven PauseManagers can halt withdrawals.',
      sources: [FORCE_LOCK, { section: 'upgrades-and-governance' }],
    },
  ],
  curatedList: true,
})
